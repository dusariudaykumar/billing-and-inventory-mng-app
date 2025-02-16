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
      {
        $lookup: {
          from: 'customers',
          localField: 'customerId',
          foreignField: '_id',
          as: 'customerInfo',
        },
      },
      {
        $unwind: { path: '$customerInfo', preserveNullAndEmptyArrays: true },
      },
      {
        $match: query,
      },
      {
        $project: {
          'customerInfo.createdAt': 0,
          'customerInfo.updatedAt': 0,
          'customerInfo.__v': 0,
        },
      },
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
            $cond: {
              if: { $eq: [{ $size: '$metadata' }, 0] },
              then: 0,
              else: { $arrayElemAt: ['$metadata.totalResults', 0] },
            },
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
