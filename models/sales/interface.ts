import mongoose, { Document, Model } from 'mongoose';

export interface ISales {
  invoiceNumber: string;
  customerId: mongoose.Types.ObjectId;
  vehicleNumber: string;
  invoiceDate: Date;
  items: Item[];
  customerPaid: number;
  totalAmount: number;
  dueAmount: number;
  discount?: number;
  status: InvoiceStatus;
  paymentMethod: PaymentMethods;
  notes: string;
  isActive: boolean;
}

interface Item {
  itemId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  sellingPrice: number;
  amount: number;
  discount: number;
  units: string;
  isCustomService?: boolean;
}

export enum PaymentMethods {
  CASH = 'Cash',
  CARD = 'Card',
  UPI = 'UPI',
  BANK_TRANSFER = 'Bank Transfer',
}
export enum InvoiceStatus {
  PAID = 'Paid',
  PARTIALLY_PAID = 'Partially Paid',
  UNPAID = 'Unpaid',
}

export interface ISalesDoc extends ISales, Document {}

export type ISalesModel = Model<ISalesDoc>;
