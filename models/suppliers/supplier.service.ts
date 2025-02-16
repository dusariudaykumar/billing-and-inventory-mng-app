import { ISupplier } from '@/models/suppliers/interface';
import Supplier from '@/models/suppliers/supplier.modal';

export const getAllSuppliers = async () => {
  const result = await Supplier.find({});
  return result;
};

export const createSupplier = async (payload: ISupplier) => {
  const newCustomer = await Supplier.create(payload);
  return newCustomer;
};

export const isSupplierExists = async (name: string, companyName: string) => {
  const isExists = await Supplier.findOne({ name, companyName });
  return !!isExists;
};
