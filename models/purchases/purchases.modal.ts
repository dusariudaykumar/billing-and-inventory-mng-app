import mongoose from 'mongoose';

import { IPurchasesDoc, IPurchasesModel } from './interface';

const purchasesSchema = new mongoose.Schema<IPurchasesDoc, IPurchasesModel>(
  {
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    items: {
      type: [],
      required: true,
    },
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
  },
  {
    timestamps: true,
  }
);

const Purchases =
  (mongoose.models.Purchases as IPurchasesModel) ||
  mongoose.model<IPurchasesDoc, IPurchasesModel>('Purchases', purchasesSchema);

export default Purchases;
