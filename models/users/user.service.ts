import { generateJWTToken } from '@/lib/generateToken';
import User from '@/models/users/user.model';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

/**
 * Authenticate User & Generate Token
 */
export const authenticateUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).lean();
  if (!user) throw new Error('Account not found');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Incorrect password');

  const token = generateJWTToken(user._id as mongoose.Types.ObjectId);
  return { user, token };
};

/**
 * Register New User (Restricted to Approved Emails)
 */
export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const approvedEmails = process.env.APPROVED_EMAILS?.split(',') || [];
  if (!approvedEmails.includes(email))
    throw new Error('Signup not allowed for this email');

  const existingUser = await User.findOne({ email }).lean();
  if (existingUser) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  return await User.create({ name, email, password: hashedPassword });
};

/**
 * Verify User from Token
 */
export const getUserFromToken = async (userId: string) => {
  return await User.findById(userId).select('-password').lean();
};
