import Customer from 'models/customers/customer.model';
import { ICustomer } from 'models/customers/interface';

/**
 * Retrieves all customers based on query, pagination, and sorting.
 */
export const getAllCustomers = async (
  query: object,
  limit: number,
  page: number
) => {
  const customers = await Customer.find({ isActive: true, ...query })
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const count = await Customer.countDocuments(query);

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
export const createCustomer = async (payload: ICustomer) => {
  return await Customer.create(payload);
};

/**
 * Checks if a customer with the given name and companyName exists.
 */
export const isCustomerExists = async (name: string, companyName: string) => {
  return !!(await Customer.findOne({ name, companyName }));
};

/**
 * Retrieves a customer by ID.
 */
export const getCustomerById = async (id: string) => {
  return await Customer.findById(id);
};

/**
 * Updates a customer by ID with the given payload.
 */
export const updateCustomer = async (
  id: string,
  payload: Partial<ICustomer>
) => {
  return await Customer.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

/**
 * Deletes a customer by ID.
 */
export const deleteCustomer = async (id: string) => {
  return await Customer.findByIdAndUpdate(id, { $set: { isActive: false } });
};
