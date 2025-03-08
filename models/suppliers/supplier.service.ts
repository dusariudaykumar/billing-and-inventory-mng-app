import { ISupplier } from '@/models/suppliers/interface';
import Supplier from '@/models/suppliers/supplier.modal';

/**
 * Fetches all suppliers.
 */
export const getAllSuppliers = async () => {
  return await Supplier.find({});
};

/**
 * Creates a new supplier.
 */
export const createSupplier = async (payload: ISupplier) => {
  return await Supplier.create(payload);
};

/**
 * Checks if a supplier exists based on name and company name.
 */
export const isSupplierExists = async (name: string, companyName: string) => {
  return !!(await Supplier.findOne({ name, companyName }));
};

/**
 * Updates a supplier by ID.
 */
export const updateSupplier = async (
  id: string,
  payload: Partial<ISupplier>
) => {
  return await Supplier.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

/**
 * Deletes a supplier by ID.
 */
export const deleteSupplier = async (id: string) => {
  return await Supplier.findByIdAndDelete(id);
};
