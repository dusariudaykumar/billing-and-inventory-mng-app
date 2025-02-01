import { Document, Model } from 'mongoose';

export interface ICustomer {
  name: string;
  companyName: string;
  contactDetails: ContactDetails;
}

export interface ContactDetails {
  phone: string;
  email: string | null;
  address: string | null;
}

export interface ICustomerDoc extends Document, ICustomer {}
export type ICustomerModel = Model<ICustomerDoc>;
