import dbConnect from '@/lib/dbConnect';
import Customer from '@/models/customers/customer.model';
import Inventory from '@/models/inventory/inventory.model';
import Purchases from '@/models/purchases/purchases.modal';
import Sales from '@/models/sales/sales.modal';
import Store from '@/models/stores/store.model';
import Supplier from '@/models/suppliers/supplier.modal';
import { NextApiRequest, NextApiResponse } from 'next';

const DEFAULT_STORE_CODE = 'SRD-01'; // Peedhamberpet

/**
 * Migration endpoint - POST /api/migrate/store-data
 * This will assign all existing records without storeId to the Peedhamberpet store
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

    // Find the default store
    const defaultStore = await Store.findOne({ code: DEFAULT_STORE_CODE });

    if (!defaultStore) {
      return res.status(404).json({
        success: false,
        message: `Default store with code "${DEFAULT_STORE_CODE}" not found. Please run the seed script first.`,
      });
    }

    const storeId = defaultStore._id;

    // Migrate all entities
    const [
      customersResult,
      inventoryResult,
      salesResult,
      purchasesResult,
      suppliersResult,
    ] = await Promise.all([
      // Migrate Customers
      Customer.updateMany(
        { storeId: { $exists: false } },
        { $set: { storeId: storeId } }
      ),
      // Migrate Inventory
      Inventory.updateMany(
        { storeId: { $exists: false } },
        { $set: { storeId: storeId } }
      ),
      // Migrate Sales
      Sales.updateMany(
        { storeId: { $exists: false } },
        { $set: { storeId: storeId } }
      ),
      // Migrate Purchases
      Purchases.updateMany(
        { storeId: { $exists: false } },
        { $set: { storeId: storeId } }
      ),
      // Migrate Suppliers
      Supplier.updateMany(
        { storeId: { $exists: false } },
        { $set: { storeId: storeId } }
      ),
    ]);

    const totalUpdated =
      customersResult.modifiedCount +
      inventoryResult.modifiedCount +
      salesResult.modifiedCount +
      purchasesResult.modifiedCount +
      suppliersResult.modifiedCount;

    return res.status(200).json({
      success: true,
      message: 'Migration completed successfully',
      data: {
        store: {
          name: defaultStore.name,
          code: defaultStore.code,
          _id: defaultStore._id,
        },
        migration: {
          customers: customersResult.modifiedCount,
          inventory: inventoryResult.modifiedCount,
          sales: salesResult.modifiedCount,
          purchases: purchasesResult.modifiedCount,
          suppliers: suppliersResult.modifiedCount,
          total: totalUpdated,
        },
      },
    });
  } catch (error: any) {
    console.error('Error during migration:', error);
    return res.status(500).json({
      success: false,
      message: 'Error during migration',
      error: error.message,
    });
  }
}
