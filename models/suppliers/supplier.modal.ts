import mongoose from 'mongoose';

import { ISupplierDoc, ISupplierModal } from './interface';

const supplierSchema = new mongoose.Schema<ISupplierDoc, ISupplierModal>(
  {
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

const Supplier =
  (mongoose.models.Suppliers as ISupplierModal) ||
  mongoose.model<ISupplierDoc, ISupplierModal>('Suppliers', supplierSchema);

export default Supplier;
