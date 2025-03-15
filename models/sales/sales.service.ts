import Inventory from '@/models/inventory/inventory.model';
import { ISales } from '@/models/sales/interface';
import Sales from '@/models/sales/sales.modal';
import mongoose from 'mongoose';

/**
 * Fetch paginated sales records with working search filter.
 */
export const getAllSales = async (query: any, limit: number, page: number) => {
  try {
    const skip = (page - 1) * limit;

    const pipeline: mongoose.PipelineStage[] = [
      { $match: { isActive: true } },
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
export const createInvoice = async (payload: ISales) => {
  try {
    const { customerId, items, ...info } = payload;

    const formattedCustomerId = new mongoose.Types.ObjectId(customerId);
    const formattedItems = items.map(({ itemId, ...rest }) => ({
      itemId: new mongoose.Types.ObjectId(itemId),
      ...rest,
    }));

    // Update inventory in bulk
    const bulkUpdates = formattedItems.map((item) => ({
      updateOne: {
        filter: { _id: item.itemId },
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
  id: mongoose.Types.ObjectId,
  payload: Partial<ISales>
) => {
  return await Sales.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

export const getSalesById = async (id: mongoose.Types.ObjectId) => {
  try {
    const sales = await Sales.findOne({ _id: id }).populate({
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
export const deleteInvoiceById = async (id: mongoose.Types.ObjectId) => {
  return await Sales.findByIdAndUpdate(id, { $set: { isActive: false } });
};
