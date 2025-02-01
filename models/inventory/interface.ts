import { Document, Model } from 'mongoose';

export interface Inventory {
  name: string;
  cost: number;
  quantity: number;
}

export interface InventoryDoc extends Inventory, Document {}

export type InventoryModel = Model<InventoryDoc>;
