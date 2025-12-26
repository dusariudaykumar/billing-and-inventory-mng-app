import logger from '@/lib/logger';
import { textToMongoRegExpStatements } from '@/lib/mongo-funs';
import { convertStoreIdToObjectId } from '@/lib/store-id-helper';
import Inventory from '@/models/inventory/inventory.model';
import { ISales } from '@/models/sales/interface';
import _ from 'lodash';
import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import * as salesService from './sales.service';

/**
 * Handles fetching sales data with pagination and search.
 */
export const handleGetSales = async (
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

    let baseQuery: object = {};
    const { page = 1, limit = 10, search } = req.query;

    const searchProps = [
      'customerInfo.name',
      'customerInfo.email',
      'customerInfo.phone',
      'invoiceNumber',
    ];

    if (typeof search === 'string') {
      baseQuery = {
        $or: _.chain(searchProps)
          .map((props) => textToMongoRegExpStatements(props, search))
          .flatten()
          .filter(Boolean)
          .value(),
      };
    }

    const storeObjectId = convertStoreIdToObjectId(storeId);
    const salesData = await salesService.getAllSales(
      storeObjectId,
      baseQuery,
      Number(limit),
      Number(page)
    );
    return res.status(200).json({ success: true, data: salesData });
  } catch (error) {
    logger(error, 'Sales API Error:');
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};

/**
 * Handles fetching a specific invoice by ID.
 */
export const handleGetInvoice = async (
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

    if (!id || typeof id !== 'string') {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid ID provided.' });
    }

    const storeObjectId = convertStoreIdToObjectId(storeId);
    const objId = new mongoose.Types.ObjectId(id);
    const sales = await salesService.getSalesById(storeObjectId, objId);

    if (!sales) {
      return res
        .status(404)
        .json({ success: false, message: 'Invoice not found.' });
    }

    return res.status(200).json({ success: true, data: sales });
  } catch (error) {
    logger(error, 'Sales API Error:');
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};

/**
 * Handles creating an invoice.
 */
export const handleCreateInvoice = async (
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

    const payload = req.body as ISales;
    if (!payload || !payload.items?.length || !payload.customerId) {
      return res
        .status(400)
        .json({ success: false, message: 'Required fields are missing.' });
    }

    const storeObjectId = convertStoreIdToObjectId(storeId);
    const invoice = await salesService.createInvoice(storeObjectId, payload);
    return res.status(201).json({
      success: true,
      data: invoice,
      message: 'Invoice created successfully.',
    });
  } catch (error) {
    logger(error, 'Error while creating invoice');
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};

/**
 * Handles updating an invoice.
 */
export const handleUpdateInvoice = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const storeId = req.query.storeId as string;
    const { id } = req.query;
    const payload = req.body as Partial<ISales>;

    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: 'Store ID is required',
      });
    }

    if (!id || typeof id !== 'string') {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid ID provided.' });
    }

    const storeObjectId = convertStoreIdToObjectId(storeId);
    const objId = new mongoose.Types.ObjectId(id);

    // Fetch the existing invoice
    const existingInvoice = await salesService.getSalesById(
      storeObjectId,
      objId
    );
    if (!existingInvoice) {
      return res
        .status(404)
        .json({ success: false, message: 'Invoice not found.' });
    }

    // Reverse inventory changes from the old invoice
    const revertInventoryUpdates = existingInvoice.items
      .filter((item) => !item.isCustomService)
      .map((item) => ({
        updateOne: {
          filter: { _id: item.itemId },
          update: { $inc: { quantity: item.quantity } },
        },
      }));

    if (revertInventoryUpdates.length > 0) {
      await Inventory.bulkWrite(revertInventoryUpdates);
    }

    // Apply new inventory updates
    const newInventoryUpdates = payload.items
      ?.filter((item: any) => !item.isCustomService)
      ?.map((item: any) => ({
        updateOne: {
          filter: { _id: new mongoose.Types.ObjectId(item.itemId) },
          update: { $inc: { quantity: -item.quantity } }, // Deduct new quantity
        },
      }));

    if (newInventoryUpdates && newInventoryUpdates.length > 0) {
      await Inventory.bulkWrite(newInventoryUpdates);
    }

    // Update the invoice
    const updatedInvoice = await salesService.updateInvoiceById(
      storeObjectId,
      objId,
      payload
    );
    return res.status(200).json({
      success: true,
      data: updatedInvoice,
      message: 'Invoice updated successfully.',
    });
  } catch (error) {
    logger(error, 'Error while updating invoice');
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};
/**
 * Handles deleting an invoice by ID.
 */
export const handleDeleteInvoiceById = async (
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

    if (!id || typeof id !== 'string') {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid ID provided.' });
    }

    const storeObjectId = convertStoreIdToObjectId(storeId);
    const objId = new mongoose.Types.ObjectId(id);
    const deletedInvoice = await salesService.deleteInvoiceById(
      storeObjectId,
      objId
    );

    if (!deletedInvoice) {
      return res
        .status(404)
        .json({ success: false, message: 'Invoice not found.' });
    }

    return res
      .status(200)
      .json({ success: true, message: 'Invoice deleted successfully.' });
  } catch (error) {
    logger(error, 'Error while deleting invoice');
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};
