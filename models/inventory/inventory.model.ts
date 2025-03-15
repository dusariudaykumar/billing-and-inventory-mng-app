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

const Inventory =
  (mongoose.models.Inventorys as InventoryModel) ||
  mongoose.model<InventoryDoc, InventoryModel>('Inventorys', inventorySchema);

export default Inventory;
