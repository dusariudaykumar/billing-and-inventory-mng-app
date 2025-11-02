import mongoose, { Document, Model } from 'mongoose';

export interface Inventory {
  name: string;
  sellingPrice: number;
  quantity: number;
  units: string;
  purchasePrice: number;
  storeId: mongoose.Types.ObjectId;
  isActive: boolean;
}

export interface InventoryDoc extends Inventory, Document {}

export type InventoryModel = Model<InventoryDoc>;
