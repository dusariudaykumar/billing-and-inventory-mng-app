import mongoose from 'mongoose';

import { InventoryDoc, InventoryModel } from './interface';

const inventorySchema = new mongoose.Schema<InventoryDoc, InventoryModel>(
  {
    name: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
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
