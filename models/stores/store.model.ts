import { IStoreDoc, IStoreModel } from '@/models/stores/store.interface';
import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema<IStoreDoc, IStoreModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    address: {
      type: String,
      required: false,
      trim: true,
    },
    contactDetails: {
      type: Object,
      required: false,
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

// Add index for faster queries
storeSchema.index({ isActive: 1 });

const Store =
  (mongoose.models.Stores as IStoreModel) ||
  mongoose.model<IStoreDoc, IStoreModel>('Stores', storeSchema);

export default Store;
