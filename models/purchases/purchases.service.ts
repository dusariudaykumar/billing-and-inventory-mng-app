import { IPurchases } from '@/models/purchases/interface';
import mongoose from 'mongoose';
import Purchases from './purchases.modal';

/**
 * Create a new purchase
 */
export const createPurchase = async (
  storeId: mongoose.Types.ObjectId,
  payload: IPurchases
) => {
  return await Purchases.create({ ...payload, storeId });
};

/**
 * Get all purchases (with optional pagination)
 */
export const getAllPurchases = async (
  storeId: mongoose.Types.ObjectId,
  limit: number,
  page: number
) => {
  const skip = (page - 1) * limit;
  const purchases = await Purchases.find({ isActive: true, storeId })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const count = await Purchases.countDocuments({ isActive: true, storeId });

  return {
    purchases,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalResults: count,
  };
};

/**
 * Get a single purchase by ID
 */
export const getPurchaseById = async (
  storeId: mongoose.Types.ObjectId,
  id: string
) => {
  return await Purchases.findOne({ _id: id, storeId });
};

/**
 * Update an existing purchase
 */
export const updatePurchase = async (
  storeId: mongoose.Types.ObjectId,
  id: string,
  payload: Partial<IPurchases>
) => {
  return await Purchases.findOneAndUpdate({ _id: id, storeId }, payload, {
    new: true,
    runValidators: true,
  });
};

/**
 * Delete a purchase by ID
 */
export const deletePurchase = async (
  storeId: mongoose.Types.ObjectId,
  id: string
) => {
  return await Purchases.findOneAndUpdate(
    { _id: id, storeId },
    { $set: { isActive: false } }
  );
};
