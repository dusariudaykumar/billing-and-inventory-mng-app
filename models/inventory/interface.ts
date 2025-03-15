import { Document, Model } from 'mongoose';

export interface Inventory {
  name: string;
  sellingPrice: number;
  quantity: number;
  units: string;
  purchasePrice: number;
  isActive: boolean;
}

export interface InventoryDoc extends Inventory, Document {}

export type InventoryModel = Model<InventoryDoc>;
