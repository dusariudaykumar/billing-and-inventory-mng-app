import Inventory from '@/models/inventory/inventory.model';
import { InvoiceStatus, ISales } from '@/models/sales/interface';
import Sales from '@/models/sales/sales.modal';
import mongoose from 'mongoose';

/**
 * Fetch paginated sales records with working search filter.
 */
export const getAllSales = async (
  storeId: mongoose.Types.ObjectId,
  query: any,
  limit: number,
  page: number
) => {
  try {
    const skip = (page - 1) * limit;

    const pipeline: mongoose.PipelineStage[] = [
      { $match: { isActive: true, storeId } },
      {
        $lookup: {
          from: 'customers',
          localField: 'customerId',
          foreignField: '_id',
          as: 'customerInfo',
        },
      },
      { $unwind: { path: '$customerInfo', preserveNullAndEmptyArrays: true } },
      { $match: query },
      {
        $facet: {
          data: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
          ],
          metadata: [{ $count: 'totalResults' }],
        },
      },
      {
        $addFields: {
          totalResults: {
            $ifNull: [{ $arrayElemAt: ['$metadata.totalResults', 0] }, 0],
          },
        },
      },
    ];

    const result = await Sales.aggregate(pipeline);
    return {
      sales: result[0]?.data || [],
      totalPages: Math.ceil((result[0]?.totalResults || 0) / limit),
      current: page,
      totalResults: result[0]?.totalResults || 0,
    };
  } catch (error: any) {
    throw new Error(`Error fetching sales data: ${error?.message}`);
  }
};

/**
 * Create an invoice and update inventory accordingly.
 */
export const createInvoice = async (
  storeId: mongoose.Types.ObjectId,
  payload: ISales
) => {
  try {
    const { customerId, items, ...info } = payload;

    const formattedCustomerId = new mongoose.Types.ObjectId(customerId);
    const formattedItems = items.map(({ itemId, isCustomService, ...rest }) => {
      const itemIdForQuery =
        typeof itemId === 'string'
          ? (itemId as string).startsWith('custom-')
            ? new mongoose.Types.ObjectId()
            : new mongoose.Types.ObjectId(itemId)
          : itemId;
      return {
        itemId: itemIdForQuery,
        isCustomService: isCustomService || false,
        ...rest,
      };
    });

    // Update inventory in bulk (filtered by storeId)
    const bulkUpdates = formattedItems.map((item) => ({
      updateOne: {
        filter: { _id: item.itemId, storeId },
        update: { $inc: { quantity: -item.quantity } },
      },
    }));
    if (bulkUpdates.length > 0) {
      await Inventory.bulkWrite(bulkUpdates);
    }

    // Create the invoice
    const invoice = await Sales.create({
      customerId: formattedCustomerId,
      items: formattedItems,
      storeId,
      ...info,
    });
    return invoice;
  } catch (error: any) {
    throw new Error(`Error creating invoice: ${error?.message}`);
  }
};

/**
 * Updates an invoice by ID.
 */
export const updateInvoiceById = async (
  storeId: mongoose.Types.ObjectId,
  id: mongoose.Types.ObjectId,
  payload: Partial<ISales>
) => {
  return await Sales.findOneAndUpdate({ _id: id, storeId }, payload, {
    new: true,
    runValidators: true,
  });
};

export const getSalesById = async (
  storeId: mongoose.Types.ObjectId,
  id: mongoose.Types.ObjectId
) => {
  try {
    const sales = await Sales.findOne({
      _id: id,
      storeId,
    }).populate({
      path: 'customerId',
      select: '-createdAt -updatedAt -__v',
    });
    return sales;
  } catch (error: any) {
    throw new Error(`Error fetching invoice: ${error?.message}`);
  }
};

/**
 * Deletes an invoice by ID.
 */
export const deleteInvoiceById = async (
  storeId: mongoose.Types.ObjectId,
  id: mongoose.Types.ObjectId
) => {
  return await Sales.findOneAndUpdate(
    { _id: id, storeId },
    { $set: { isActive: false } }
  );
};

export const getUnpaidInvoicesByCustomerId = async (
  storeId: mongoose.Types.ObjectId,
  customerId: string
) => {
  try {
    const unpaidInvoices = await Sales.find({
      storeId,
      customerId: new mongoose.Types.ObjectId(customerId),
      status: { $in: [InvoiceStatus.UNPAID, InvoiceStatus.PARTIALLY_PAID] },
      isActive: true,
    }).sort({ invoiceDate: -1 });

    // Calculate total stats
    const totalInvoiceAmount = unpaidInvoices.reduce(
      (sum, invoice) => sum + invoice.totalAmount,
      0
    );

    const totalDueAmount = unpaidInvoices.reduce(
      (sum, invoice) => sum + invoice.dueAmount,
      0
    );

    return {
      invoices: unpaidInvoices,
      stats: {
        totalInvoiceAmount,
        totalDueAmount,
        invoiceCount: unpaidInvoices.length,
      },
    };
  } catch (error: any) {
    throw new Error(`Error fetching unpaid invoices: ${error?.message}`);
  }
};
