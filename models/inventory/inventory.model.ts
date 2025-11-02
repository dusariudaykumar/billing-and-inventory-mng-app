import mongoose from 'mongoose';

import { InventoryDoc, InventoryModel } from './interface';

const inventorySchema = new mongoose.Schema<InventoryDoc, InventoryModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    purchasePrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    units: {
      type: String,
      required: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stores',
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient filtering
inventorySchema.index({ storeId: 1, isActive: 1 });

const Inventory =
  (mongoose.models.Inventorys as InventoryModel) ||
  mongoose.model<InventoryDoc, InventoryModel>('Inventorys', inventorySchema);

export default Inventory;
