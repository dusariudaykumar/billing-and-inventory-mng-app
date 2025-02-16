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
  },
  {
    timestamps: true,
  }
);

const Customer =
  (mongoose.models.Customers as ICustomerModel) ||
  mongoose.model<ICustomerDoc, ICustomerModel>('Customers', customerSchema);

export default Customer;
