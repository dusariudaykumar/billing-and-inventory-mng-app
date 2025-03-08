import { IPurchases } from '@/models/purchases/interface';
import Purchases from './purchases.modal';

/**
 * Create a new purchase
 */
export const createPurchase = async (payload: IPurchases) => {
  return await Purchases.create(payload);
};

/**
 * Get all purchases (with optional pagination)
 */
export const getAllPurchases = async (limit: number, page: number) => {
  const skip = (page - 1) * limit;
  const purchases = await Purchases.find({})
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const count = await Purchases.countDocuments();

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
export const getPurchaseById = async (id: string) => {
  return await Purchases.findById(id);
};

/**
 * Update an existing purchase
 */
export const updatePurchase = async (
  id: string,
  payload: Partial<IPurchases>
) => {
  return await Purchases.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

/**
 * Delete a purchase by ID
 */
export const deletePurchase = async (id: string) => {
  return await Purchases.findByIdAndDelete(id);
};
