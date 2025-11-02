import Customer from 'models/customers/customer.model';
import { ICustomer } from 'models/customers/interface';
import mongoose from 'mongoose';

/**
 * Retrieves all customers based on query, pagination, and sorting.
 */
export const getAllCustomers = async (
  storeId: mongoose.Types.ObjectId,
  query: object,
  limit: number,
  page: number
) => {
  const filter = { isActive: true, storeId, ...query };
  const customers = await Customer.find(filter)
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const count = await Customer.countDocuments(filter);

  return {
    customers,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalResults: count,
  };
};

/**
 * Creates a new customer in the database.
 */
export const createCustomer = async (
  storeId: mongoose.Types.ObjectId,
  payload: ICustomer
) => {
  return await Customer.create({ ...payload, storeId });
};

/**
 * Checks if a customer with the given name and companyName exists.
 */
export const isCustomerExists = async (
  storeId: mongoose.Types.ObjectId,
  name: string,
  companyName: string
) => {
  return !!(await Customer.findOne({
    storeId,
    name,
    companyName,
  }));
};

/**
 * Retrieves a customer by ID.
 */
export const getCustomerById = async (
  storeId: mongoose.Types.ObjectId,
  id: string
) => {
  return await Customer.findOne({ _id: id, storeId });
};

/**
 * Updates a customer by ID with the given payload.
 */
export const updateCustomer = async (
  storeId: mongoose.Types.ObjectId,
  id: string,
  payload: Partial<ICustomer>
) => {
  return await Customer.findOneAndUpdate({ _id: id, storeId }, payload, {
    new: true,
    runValidators: true,
  });
};

/**
 * Deletes a customer by ID.
 */
export const deleteCustomer = async (
  storeId: mongoose.Types.ObjectId,
  id: string
) => {
  return await Customer.findOneAndUpdate(
    { _id: id, storeId },
    { $set: { isActive: false } }
  );
};
