import { ISupplier } from '@/models/suppliers/interface';
import Supplier from '@/models/suppliers/supplier.modal';
import mongoose from 'mongoose';

/**
 * Fetches all suppliers.
 */
export const getAllSuppliers = async (
  storeId: mongoose.Types.ObjectId,
  query: object,
  limit: number,
  page: number
) => {
  const filter = { isActive: true, storeId, ...query };
  const suppliers = await Supplier.find(filter)
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const count = await Supplier.countDocuments(filter);
  return {
    suppliers,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalResults: count,
  };
};

/**
 * Creates a new supplier.
 */
export const createSupplier = async (
  storeId: mongoose.Types.ObjectId,
  payload: ISupplier
) => {
  return await Supplier.create({ ...payload, storeId });
};

/**
 * Checks if a supplier exists based on name and company name.
 */
export const isSupplierExists = async (
  storeId: mongoose.Types.ObjectId,
  name: string,
  companyName: string
) => {
  return !!(await Supplier.findOne({ storeId, name, companyName }));
};

/**
 * Updates a supplier by ID.
 */
export const updateSupplier = async (
  storeId: mongoose.Types.ObjectId,
  id: string,
  payload: Partial<ISupplier>
) => {
  return await Supplier.findOneAndUpdate({ _id: id, storeId }, payload, {
    new: true,
    runValidators: true,
  });
};

/**
 * Deletes a supplier by ID.
 */
export const deleteSupplier = async (
  storeId: mongoose.Types.ObjectId,
  id: string
) => {
  return await Supplier.findOneAndUpdate(
    { _id: id, storeId },
    { $set: { isActive: false } }
  );
};
