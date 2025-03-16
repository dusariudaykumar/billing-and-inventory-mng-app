import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

/**
 * Generates a JWT token for a given user ID.
 * @param userId - User ID (MongoDB ObjectId)
 * @returns JWT Token
 */
export const generateJWTToken = (userId: mongoose.Types.ObjectId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  return jwt.sign({ sub: userId }, secret as string, {
    expiresIn: '7d', // Token expires in 7 days
  });
};
