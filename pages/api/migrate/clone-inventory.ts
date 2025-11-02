import dbConnect from '@/lib/dbConnect';
import logger from '@/lib/logger';
import Inventory from '@/models/inventory/inventory.model';
import Store from '@/models/stores/store.model';
import { NextApiRequest, NextApiResponse } from 'next';

const SOURCE_STORE_CODE = 'SRD-01'; // Pedda Amberpet
const TARGET_STORE_CODE = 'SRD-02'; // Srikakulam

/**
 * Clone inventory endpoint - POST /api/migrate/clone-inventory
 * This will clone all inventory items from SRD-01 to SRD-02
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST.',
    });
  }

  try {
    await dbConnect();

    // Find source and target stores
    const [sourceStore, targetStore] = await Promise.all([
      Store.findOne({ code: SOURCE_STORE_CODE }),
      Store.findOne({ code: TARGET_STORE_CODE }),
    ]);

    if (!sourceStore) {
      return res.status(404).json({
        success: false,
        message: `Source store with code "${SOURCE_STORE_CODE}" not found.`,
      });
    }

    if (!targetStore) {
      return res.status(404).json({
        success: false,
        message: `Target store with code "${TARGET_STORE_CODE}" not found. Please run the seed script first.`,
      });
    }

    // Check if target store already has inventory items
    const existingTargetInventory = await Inventory.countDocuments({
      storeId: targetStore._id,
    });

    if (existingTargetInventory > 0) {
      return res.status(400).json({
        success: false,
        message: `Target store "${TARGET_STORE_CODE}" already has ${existingTargetInventory} inventory item(s). Please delete them first if you want to clone again.`,
      });
    }

    // Find all inventory items from source store
    const sourceInventoryItems = await Inventory.find({
      storeId: sourceStore._id,
      isActive: true,
    }).lean();

    if (sourceInventoryItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No inventory items found in source store "${SOURCE_STORE_CODE}".`,
      });
    }

    // Clone inventory items for target store
    const clonedItems = sourceInventoryItems.map((item) => {
      // Create a new item object without _id and timestamps
      const { _id, __v, storeId: _storeId, ...itemData } = item;
      return {
        ...itemData,
        storeId: targetStore._id,
        quantity: 99, // Reset quantity for new store
      };
    });

    // Insert cloned items
    const result = await Inventory.insertMany(clonedItems);

    return res.status(200).json({
      success: true,
      message: `Successfully cloned ${result.length} inventory item(s) from ${SOURCE_STORE_CODE} to ${TARGET_STORE_CODE}`,
      data: {
        sourceStore: {
          name: sourceStore.name,
          code: sourceStore.code,
          _id: sourceStore._id,
          itemCount: sourceInventoryItems.length,
        },
        targetStore: {
          name: targetStore.name,
          code: targetStore.code,
          _id: targetStore._id,
        },
        clonedItems: result.length,
        items: result.map((item) => ({
          _id: item._id,
          name: item.name,
          quantity: item.quantity,
          units: item.units,
        })),
      },
    });
  } catch (error: any) {
    logger(error, 'Error cloning inventory');
    return res.status(500).json({
      success: false,
      message: 'Error cloning inventory items',
      error: error.message,
    });
  }
}
