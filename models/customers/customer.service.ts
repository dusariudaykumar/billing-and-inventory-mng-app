import Customer from 'models/customers/customer.model';
import { ICustomer } from 'models/customers/interface';

export const getAllCustomers = async () => {
  const result = await Customer.find({});
  return result;
};

export const createCustomer = async (payload: ICustomer) => {
  const newCustomer = await Customer.create(payload);
  return newCustomer;
};

export const isCustomerExists = async (name: string, companyName: string) => {
  const isExists = await Customer.findOne({ name, companyName });
  return !!isExists;
};
