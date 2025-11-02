import logger from '@/lib/logger';
import { convertStoreIdToObjectId } from '@/lib/store-id-helper';
import { NextApiRequest, NextApiResponse } from 'next';
import { fetchDashboardData } from './dashboard.service';

export const getDashboardData = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const storeId = req.query.storeId as string;
    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: 'Store ID is required',
      });
    }

    const storeObjectId = convertStoreIdToObjectId(storeId);

    // Get raw dashboard data
    const dashboardData = await fetchDashboardData(storeObjectId);

    // Combine all data
    const dashboard = {
      stats: {
        totalRevenue: dashboardData.totalRevenue,
        totalDue: dashboardData.totalDue,
        totalCustomers: dashboardData.totalCustomers,
        totalItems: dashboardData.totalItems,
      },
      customersWithDues: dashboardData.customersWithDues,
      monthlySalesData: dashboardData.monthlySalesData,
      revenueStatus: dashboardData.revenueStatus,
      recentSales: dashboardData.recentSales,
      lowStockItems: dashboardData.lowStockItems,
    };

    return res.status(200).json({ success: true, data: dashboard });
  } catch (error) {
    logger(error, 'Error fetching dashboard data');
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};
