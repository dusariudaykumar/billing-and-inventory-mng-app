import { Document, Model } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IUserDoc extends IUser, Document {}

export type IUserModel = Model<IUserDoc>;
