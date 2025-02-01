/**
 * A response represents a [JSend](https://github.com/omniti-labs/jsend) response returned by the API
 */
export type IResponse<T> = {
  /** The status */
  success: boolean;

  /** The response data (optional if status === 'error', otherwise required) */
  data?: T;

  /** An optional message if status === 'error' */
  message?: string;
};

export interface User {
  _id: string;
  name: string;
  email: string;
  // token: string;
}

export type UserAPIResponse = IResponse<User>;

export interface Customer {
  name: string;
  companyName: string;
  contactDetails: ContactDetails;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactDetails {
  phone: string;
  email: string | null;
  address: string | null;
}

export type GetAllCustomersAPIResponse = IResponse<Customer[]>;

export type CreateCustomerPayload = Omit<
  Customer,
  '_id' | 'createdAt' | 'updatedAt'
>;

export type CreateCutomerAPIResponse = IResponse<Customer>;
