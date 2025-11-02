// models/dashboard/dashboard.service.ts
import Customer from '@/models/customers/customer.model';
import Inventory from '@/models/inventory/inventory.model';
import Sales from '@/models/sales/sales.modal';
import mongoose from 'mongoose';

/**
 * Fetches all the data needed for the dashboard in an efficient manner
 */
export const fetchDashboardData = async (storeId: mongoose.Types.ObjectId) => {
  // Get current date and start of current month
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Get all active sales for this store
  const allSales = await Sales.find({ isActive: true, storeId })
    .populate({
      path: 'customerId',
      select: 'name companyName contactDetails',
    })
    .lean();

  // Calculate total revenue and due amount
  const totalRevenue = allSales.reduce(
    (sum, sale) => sum + sale.totalAmount,
    0
  );
  const totalDue = allSales.reduce((sum, sale) => sum + sale.dueAmount, 0);

  // Get total customer count for this store
  const totalCustomers = await Customer.countDocuments({
    isActive: true,
    storeId,
  });

  // Get total inventory items count for this store
  const totalItems = await Inventory.countDocuments({
    isActive: true,
    storeId,
  });

  // Get customers with outstanding dues
  const customersWithDues = await getCustomersWithDues(storeId);

  // Calculate monthly sales data for the current year
  const monthlySalesData = await getMonthlySalesData(storeId, currentYear);

  // Get revenue status breakdown
  const revenueStatus = getRevenueStatus(allSales);

  // Get recent sales
  const recentSales = getRecentSales(allSales);

  // Get low stock items
  const lowStockItems = await getLowStockItems(storeId);

  return {
    totalRevenue,
    totalDue,
    totalCustomers,
    totalItems,
    customersWithDues,
    monthlySalesData,
    revenueStatus,
    recentSales,
    lowStockItems,
  };
};

/**
 * Get customers with outstanding dues
 */
const getCustomersWithDues = async (storeId: mongoose.Types.ObjectId) => {
  // Use aggregation to group dues by customer
  const customerDues = await Sales.aggregate([
    {
      $match: { isActive: true, storeId, dueAmount: { $gt: 0 } },
    },
    {
      $group: {
        _id: '$customerId',
        dueAmount: { $sum: '$dueAmount' },
        invoiceCount: { $sum: 1 },
        lastInvoiceDate: { $max: '$invoiceDate' },
      },
    },
    { $sort: { dueAmount: -1 } },
    { $limit: 5 },
  ]);

  // Get customer details for these customers
  const customerIds = customerDues.map((item) => item._id);
  const customers = await Customer.find({
    _id: { $in: customerIds },
    storeId,
    isActive: true,
  }).lean();

  // Combine customer details with dues info
  return customerDues
    .map((due) => {
      const customer = customers.find(
        (c) => c._id.toString() === due._id.toString()
      );
      if (!customer) return null;

      return {
        id: customer._id,
        name: customer.name,
        companyName: customer.companyName,
        contactInfo: {
          phone: customer.contactDetails?.phone,
          email: customer.contactDetails?.email,
        },
        dueAmount: due.dueAmount,
        invoiceCount: due.invoiceCount,
        lastInvoiceDate: due.lastInvoiceDate,
      };
    })
    .filter(Boolean);
};

/**
 * Get monthly sales data for the given year
 */
const getMonthlySalesData = async (
  storeId: mongoose.Types.ObjectId,
  year: number
) => {
  // Use aggregation to calculate monthly sales and revenue
  const monthlyData = await Sales.aggregate([
    {
      $match: {
        isActive: true,
        storeId,
        invoiceDate: {
          $gte: new Date(year, 0, 1),
          $lt: new Date(year + 1, 0, 1),
        },
      },
    },
    {
      $group: {
        _id: { month: { $month: '$invoiceDate' } },
        sales: { $sum: 1 },
        revenue: { $sum: '$totalAmount' },
      },
    },
    { $sort: { '_id.month': 1 } },
  ]);

  // Convert to the format needed for charts
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Initialize with zeros
  const result = months.map((month, index) => ({
    month,
    sales: 0,
    revenue: 0,
  }));

  // Fill in actual data
  monthlyData.forEach((item) => {
    const monthIndex = item._id.month - 1;
    result[monthIndex].sales = item.sales;
    result[monthIndex].revenue = item.revenue;
  });

  return result;
};

/**
 * Get revenue status breakdown
 */
const getRevenueStatus = (sales) => {
  const paid = sales
    .filter((sale) => sale.status === 'Paid')
    .reduce((sum, sale) => sum + sale.totalAmount, 0);

  const partiallyPaid = sales
    .filter((sale) => sale.status === 'Partially Paid')
    .reduce((sum, sale) => sum + sale.totalAmount, 0);

  const unpaid = sales
    .filter((sale) => sale.status === 'Unpaid')
    .reduce((sum, sale) => sum + sale.totalAmount, 0);

  return [
    { name: 'Paid', value: paid },
    { name: 'Partially Paid', value: partiallyPaid },
    { name: 'Unpaid', value: unpaid },
  ];
};

/**
 * Get recent sales
 */
const getRecentSales = (sales) => {
  return sales
    .sort(
      (a, b) =>
        new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime()
    )
    .slice(0, 5)
    .map((sale) => ({
      _id: sale._id,
      customerInfo: {
        name: sale.customerId?.name || 'Unknown',
      },
      invoiceNumber: sale.invoiceNumber,
      totalAmount: sale.totalAmount,
      status: sale.status,
      date: sale.invoiceDate,
    }));
};

/**
 * Get low stock items
 */
const getLowStockItems = async (storeId: mongoose.Types.ObjectId) => {
  return await Inventory.find({
    isActive: true,
    storeId,
    quantity: { $lt: 10 },
  })
    .sort({ quantity: 1 })
    .limit(5)
    .lean();
};

/**
 * Calculate percentage change in revenue from previous month
 */
export const calculateRevenueChange = async (
  storeId: mongoose.Types.ObjectId
) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Get current month revenue
  const currentMonthRevenue = await Sales.aggregate([
    {
      $match: {
        isActive: true,
        storeId,
        invoiceDate: {
          $gte: new Date(currentYear, currentMonth, 1),
          $lt: new Date(currentYear, currentMonth + 1, 1),
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$totalAmount' },
      },
    },
  ]);

  // Get previous month revenue
  const previousMonthRevenue = await Sales.aggregate([
    {
      $match: {
        isActive: true,
        storeId,
        invoiceDate: {
          $gte: new Date(currentYear, currentMonth - 1, 1),
          $lt: new Date(currentYear, currentMonth, 1),
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$totalAmount' },
      },
    },
  ]);

  const currentTotal = currentMonthRevenue[0]?.total || 0;
  const previousTotal = previousMonthRevenue[0]?.total || 0;

  if (previousTotal === 0) return 0;

  return Number(
    (((currentTotal - previousTotal) / previousTotal) * 100).toFixed(1)
  );
};

/**
 * Calculate percentage change in due amount from previous month
 */
export const calculateDueAmountChange = async (
  storeId: mongoose.Types.ObjectId
) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Get current month dues
  const currentMonthDues = await Sales.aggregate([
    {
      $match: {
        isActive: true,
        storeId,
        invoiceDate: {
          $gte: new Date(currentYear, currentMonth, 1),
          $lt: new Date(currentYear, currentMonth + 1, 1),
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$dueAmount' },
      },
    },
  ]);

  // Get previous month dues
  const previousMonthDues = await Sales.aggregate([
    {
      $match: {
        isActive: true,
        storeId,
        invoiceDate: {
          $gte: new Date(currentYear, currentMonth - 1, 1),
          $lt: new Date(currentYear, currentMonth, 1),
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$dueAmount' },
      },
    },
  ]);

  const currentTotal = currentMonthDues[0]?.total || 0;
  const previousTotal = previousMonthDues[0]?.total || 0;

  if (previousTotal === 0) return 0;

  return Number(
    (((currentTotal - previousTotal) / previousTotal) * 100).toFixed(1)
  );
};

/**
 * Calculate percentage change in customer count
 */
export const calculateCustomerChange = async (
  storeId: mongoose.Types.ObjectId
) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Count customers created in current month
  const currentMonthCustomers = await Customer.countDocuments({
    storeId,
    createdAt: {
      $gte: new Date(currentYear, currentMonth, 1),
      $lt: new Date(currentYear, currentMonth + 1, 1),
    },
  });

  // Count customers created in previous month
  const previousMonthCustomers = await Customer.countDocuments({
    storeId,
    createdAt: {
      $gte: new Date(currentYear, currentMonth - 1, 1),
      $lt: new Date(currentYear, currentMonth, 1),
    },
  });

  if (previousMonthCustomers === 0) return 0;

  return Number(
    (
      ((currentMonthCustomers - previousMonthCustomers) /
        previousMonthCustomers) *
      100
    ).toFixed(1)
  );
};

/**
 * Calculate percentage change in inventory count
 */
export const calculateInventoryChange = async (
  storeId: mongoose.Types.ObjectId
) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Count inventory items created in current month
  const currentMonthItems = await Inventory.countDocuments({
    storeId,
    createdAt: {
      $gte: new Date(currentYear, currentMonth, 1),
      $lt: new Date(currentYear, currentMonth + 1, 1),
    },
  });

  // Count inventory items created in previous month
  const previousMonthItems = await Inventory.countDocuments({
    storeId,
    createdAt: {
      $gte: new Date(currentYear, currentMonth - 1, 1),
      $lt: new Date(currentYear, currentMonth, 1),
    },
  });

  if (previousMonthItems === 0) return 0;

  return Number(
    (
      ((currentMonthItems - previousMonthItems) / previousMonthItems) *
      100
    ).toFixed(1)
  );
};
