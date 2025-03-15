import mongoose from 'mongoose';
import { IPurchasesDoc, IPurchasesModel } from './interface';

const purchasesSchema = new mongoose.Schema<IPurchasesDoc, IPurchasesModel>(
  {
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier', // Reference supplier model
      required: true,
    },
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Inventory',
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    amountPaid: {
      type: Number,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    dueAmount: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  { timestamps: true }
);

const Purchases =
  (mongoose.models.Purchases as IPurchasesModel) ||
  mongoose.model<IPurchasesDoc, IPurchasesModel>('Purchases', purchasesSchema);

export default Purchases;
