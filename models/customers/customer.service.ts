import Customer from 'models/customers/customer.model';
import { ICustomer } from 'models/customers/interface';

export const getAllCustomers = async (
  query: object,
  limit: number,
  page: number
) => {
  const customers = await Customer.find({ ...query })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const count = await Customer.countDocuments();

  return {
    customers,
    totalPages: Math.ceil(count / limit),
    current: page,
    totalResults: count,
  };
};

export const createCustomer = async (payload: ICustomer) => {
  const newCustomer = await Customer.create(payload);
  return newCustomer;
};

export const isCustomerExists = async (name: string, companyName: string) => {
  const isExists = await Customer.findOne({ name, companyName });
  return !!isExists;
};
