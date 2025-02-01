import mongoose, { Document, Model } from 'mongoose';

export interface ISales {
  customerId: mongoose.Types.ObjectId;
  vehicleNumber: string;
  items: Item[];
  customerPaid: number;
  paidTo: {
    mode: PaymentMode;
    name: string;
  };
  totalAmount: number;
  dueAmount: number;
  discount?: number;
}

interface Item {
  itemId: mongoose.Types.ObjectId;
  quantity: number;
}

enum PaymentMode {
  CASH = 'cash',
  ONLINE = 'online',
  CHEQUE = 'cheque',
}

export interface ISalesDoc extends ISales, Document {}

export type ISalesModel = Model<ISalesDoc>;
