import mongoose from 'mongoose';

import { IUserDoc, IUserModel } from './interface';

const userSchema = new mongoose.Schema<IUserDoc, IUserModel>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User =
  (mongoose.models.User as IUserModel) ||
  mongoose.model<IUserDoc, IUserModel>('User', userSchema);

export default User;
