import mongoose from 'mongoose';

import { ICustomerDoc, ICustomerModel } from './interface';

const customerSchema = new mongoose.Schema<ICustomerDoc, ICustomerModel>(
  {
    customerID: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    contactDetails: {
      type: Object,
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
customerSchema.index({ storeId: 1, isActive: 1 });

const Customer =
  (mongoose.models.Customers as ICustomerModel) ||
  mongoose.model<ICustomerDoc, ICustomerModel>('Customers', customerSchema);

export default Customer;
