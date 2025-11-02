import mongoose, { Document, Model } from 'mongoose';

export interface IPurchases {
  supplierId: mongoose.Types.ObjectId;
  items: Item[];
  amountPaid: number;
  totalCost: number;
  dueAmount: number;
  storeId: mongoose.Types.ObjectId;
  isActive: boolean;
}

interface Item {
  name: string;
  quantity: number;
}

export interface IPurchasesDoc extends IPurchases, Document {}
export type IPurchasesModel = Model<IPurchasesDoc>;
