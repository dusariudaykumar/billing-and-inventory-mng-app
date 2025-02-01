import mongoose from 'mongoose';

import { ISalesDoc, ISalesModel } from './interface';

const salesSchema = new mongoose.Schema<ISalesDoc, ISalesModel>(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    vehicleNumber: {
      type: String,
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
  },
  {
    timestamps: true,
  }
);

const Sales =
  (mongoose.models.Sales as ISalesModel) ||
  mongoose.model<ISalesDoc, ISalesModel>('Sales', salesSchema);

export default Sales;
