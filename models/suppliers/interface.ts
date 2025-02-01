import { Document, Model } from 'mongoose';

export interface ISupplier {
  name: string;
  companyName: string;
  contactDetails: ContactDetails;
}
export interface ContactDetails {
  phone: string;
  email: string | null;
  address: string | null;
}

export interface ISupplierDoc extends ISupplier, Document {}

export type ISupplierModal = Model<ISupplierDoc>;
