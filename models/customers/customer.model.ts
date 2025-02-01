import mongoose from 'mongoose';

import { ICustomerDoc, ICustomerModel } from './interface';

const customerSchema = new mongoose.Schema<ICustomerDoc, ICustomerModel>(
  {
    name: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
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
