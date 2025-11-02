import { InvoiceStatus } from '@/interfaces/response.interface';
import { textToMongoRegExpStatements } from '@/lib/mongo-funs';
import { convertStoreIdToObjectId } from '@/lib/store-id-helper';
import Sales from '@/models/sales/sales.modal';
import { getUnpaidInvoicesByCustomerId } from '@/models/sales/sales.service';
import logger from 'lib/logger';
import _ from 'lodash';
import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomerById,
  isCustomerExists,
  updateCustomer,
} from 'models/customers/customer.service';
import { ICustomer } from 'models/customers/interface';
import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Handles fetching all customers with optional search and pagination.
 */
export const getCustomersHandler = async (
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
    let baseQuery: object = {};
    const { page = 1, limit = 10, search } = req.query;

    const searchProps = ['name', 'companyName'];

    if (typeof search === 'string') {
      const searchQuery = _.chain(searchProps)
        .map((prop) => textToMongoRegExpStatements(prop, search))
        .flatten()
        .filter(Boolean)
        .value();
      baseQuery = { $or: searchQuery };
    }

    const customers = await getAllCustomers(
      storeObjectId,
      baseQuery,
      Number(limit),
      Number(page)
    );
    return res.status(200).json({ success: true, data: customers });
  } catch (error) {
    logger(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};

/**
 * Handles creating a new customer.
 */
export const createCustomerHandler = async (
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

    const payload = req.body as ICustomer;

    if (
      !payload ||
      !payload.companyName ||
      !payload.contactDetails ||
      !payload.name
    ) {
      return res
        .status(400)
        .send({ success: false, message: 'Required fields are missing' });
    }

    const storeObjectId = convertStoreIdToObjectId(storeId);

    // Check if customer already exists
    const isExist = await isCustomerExists(
      storeObjectId,
      payload.name,
      payload.companyName
    );

    if (!isExist) {
      const newCustomer = await createCustomer(storeObjectId, payload);
      return res.status(201).send({ success: true, data: newCustomer });
    }

    return res
      .status(400)
      .send({ success: false, message: 'Customer already exists' });
  } catch (error) {
    logger(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};

/**
 * Handles fetching detailed customer information including sales history and stats
 */
export const getCustomerDetailsHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const storeId = req.query.storeId as string;
    const { id } = req.query;

    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: 'Store ID is required',
      });
    }

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: 'Customer ID is required' });
    }

    const storeObjectId = convertStoreIdToObjectId(storeId);

    // Get customer basic information
    const customer = await getCustomerById(storeObjectId, id as string);
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: 'Customer not found' });
    }

    // Get customer's sales history
    const sales = await Sales.find({
      storeId: storeObjectId,
      customerId: new mongoose.Types.ObjectId(id as string),
      isActive: true,
    })
      .sort({ invoiceDate: -1 })
      .limit(10); // Get last 10 sales

    // Calculate customer statistics
    const allSales = await Sales.find({
      storeId: storeObjectId,
      customerId: new mongoose.Types.ObjectId(id as string),
      isActive: true,
    });

    const stats = {
      totalBusiness: allSales.reduce((sum, sale) => sum + sale.totalAmount, 0),
      dueAmount: allSales.reduce((sum, sale) => sum + sale.dueAmount, 0),
      totalInvoices: allSales.length,
      totalPaid: allSales.reduce((sum, sale) => sum + sale.customerPaid, 0),
    };

    // Transform sales data for frontend
    const recentSales = sales.map((sale) => ({
      id: sale._id,
      invoiceNumber: sale.invoiceNumber,
      date: sale.invoiceDate,
      amount: sale.totalAmount,
      customerPaid: sale.customerPaid,
      dueAmount: sale.dueAmount,
      dueDate: new Date(sale.invoiceDate.getTime() + 15 * 24 * 60 * 60 * 1000),
      status:
        sale.dueAmount === 0
          ? InvoiceStatus.PAID
          : sale.dueAmount === sale.totalAmount
          ? InvoiceStatus.UNPAID
          : sale.dueAmount > 0
          ? InvoiceStatus.PARTIALLY_PAID
          : 'Overdue',
    }));

    // Transform customer data for frontend
    const customerData = {
      id: customer._id,
      name: customer.name,
      companyName: customer?.companyName || '',
      email: customer.contactDetails?.email || '',
      phone: customer.contactDetails?.phone || '',
      address: customer.contactDetails?.address || '',
      status: customer.isActive ? 'Active' : 'Inactive',
      customerSince: ((customer as any)?.createdAt as Date).toLocaleDateString(
        'en-US',
        {
          month: 'long',
          year: 'numeric',
        }
      ),
      stats,
      recentSales,
    };

    return res.status(200).json({
      success: true,
      data: customerData,
    });
  } catch (error) {
    logger(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};

/**
 * Handles updating an existing customer.
 */
export const updateCustomerHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const storeId = req.query.storeId as string;
    const { id } = req.query;
    const payload = req.body as Partial<ICustomer>;

    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: 'Store ID is required',
      });
    }

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: 'Customer ID is required' });
    }

    const storeObjectId = convertStoreIdToObjectId(storeId);

    const existingCustomer = await getCustomerById(storeObjectId, id as string);
    if (!existingCustomer) {
      return res
        .status(404)
        .json({ success: false, message: 'Customer not found' });
    }

    const updatedCustomer = await updateCustomer(
      storeObjectId,
      id as string,
      payload
    );
    return res.status(200).json({ success: true, data: updatedCustomer });
  } catch (error) {
    logger(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};

/**
 * Handles deleting a customer by ID.
 */
export const deleteCustomerHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const storeId = req.query.storeId as string;
    const { id } = req.query;

    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: 'Store ID is required',
      });
    }

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: 'Customer ID is required' });
    }

    const storeObjectId = convertStoreIdToObjectId(storeId);

    const existingCustomer = await getCustomerById(storeObjectId, id as string);
    if (!existingCustomer) {
      return res
        .status(404)
        .json({ success: false, message: 'Customer not found' });
    }

    await deleteCustomer(storeObjectId, id as string);
    return res
      .status(200)
      .json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    logger(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};

/**
 * Handles fetching customer uppaid invoices
 */
export const getCustomerUnpaidInvoicesHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const storeId = req.query.storeId as string;
    const { id } = req.query;

    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: 'Store ID is required',
      });
    }

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: 'Customer ID is required' });
    }

    const storeObjectId = convertStoreIdToObjectId(storeId);

    const { invoices, stats } = await getUnpaidInvoicesByCustomerId(
      storeObjectId,
      id as string
    );

    const formattedInvoices = invoices.map((invoice) => ({
      id: invoice._id,
      invoiceNumber: invoice.invoiceNumber,
      date: invoice.invoiceDate,
      totalAmount: invoice.totalAmount,
      customerPaid: invoice.customerPaid,
      dueAmount: invoice.dueAmount,
      status: invoice.status,
    }));

    return res.status(200).json({
      success: true,
      data: {
        invoices: formattedInvoices,
        stats,
      },
    });
  } catch (error) {
    logger(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};
