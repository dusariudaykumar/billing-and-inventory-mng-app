import { Document, Model } from 'mongoose';

export interface IStore {
  name: string;
  code: string;
  address?: string;
  contactDetails?: ContactDetails;
  isActive: boolean;
}

export interface ContactDetails {
  phone?: string;
  email?: string;
  address?: string;
}

export interface IStoreDoc extends Document, IStore {}
export type IStoreModel = Model<IStoreDoc>;
