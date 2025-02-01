import mongoose from 'mongoose';

import { ISupplierDoc, ISupplierModal } from './interface';

const supplierSchema = new mongoose.Schema<ISupplierDoc, ISupplierModal>(
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
    },
  },
  {
    timestamps: true,
  }
);

const Supplier =
  (mongoose.models.Suppliers as ISupplierModal) ||
  mongoose.model<ISupplierDoc, ISupplierModal>('Suppliers', supplierSchema);

export default Supplier;
