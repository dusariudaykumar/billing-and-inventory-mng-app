import mongoose from 'mongoose';

import { InvoiceStatus, ISalesDoc, ISalesModel } from './interface';

const salesSchema = new mongoose.Schema<ISalesDoc, ISalesModel>(
  {
    invoiceNumber: {
      type: String,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customers',
      required: true,
    },
    vehicleNumber: {
      type: String,
      required: false,
      default: null,
    },
    invoiceDate: {
      type: Date,
      required: true,
    },
    items: {
      type: [],
      required: true,
    },
    customerPaid: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    dueAmount: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: false,
      default: 0,
    },
    status: {
      type: String,
      required: true,
      default: InvoiceStatus.UNPAID,
    },
    paymentMethod: {
      type: String,
      required: false,
    },
    notes: {
      type: String,
      required: false,
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
salesSchema.index({ storeId: 1, isActive: 1 });

const Sales =
  (mongoose.models.Sales as ISalesModel) ||
  mongoose.model<ISalesDoc, ISalesModel>('Sales', salesSchema);

export default Sales;
