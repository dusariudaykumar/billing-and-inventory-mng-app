import {
  CreateCustomerPayload,
  CreateCutomerAPIResponse,
  GetAllCustomersAPIResponse,
} from '@/interfaces/response.interface';
import axios from '@/lib/axios';
import logger from '@/lib/logger';

export const geAllCustomers = async (): Promise<GetAllCustomersAPIResponse> => {
  try {
    const res = await axios.get(`/api/customers`);
    return res.data;
  } catch (error: any) {
    logger(error, 'geAllCustomers service');
    return error?.response?.data;
  }
};

export const createNewCustomer = async (
  payload: CreateCustomerPayload
): Promise<CreateCutomerAPIResponse> => {
  try {
    const res = await axios.post(`/api/customers`, payload);
    return res.data;
  } catch (error: any) {
    logger(error, 'createNewCustomer service');
    return error?.response?.data;
  }
};
