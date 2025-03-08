import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

/**
 * Generates a JWT token for a given user ID.
 * @param userId - User ID (MongoDB ObjectId)
 * @returns JWT Token
 */
export const generateJWTToken = (userId: mongoose.Types.ObjectId) => {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET as string, {
    expiresIn: '7d', // Token expires in 7 days
  });
};
