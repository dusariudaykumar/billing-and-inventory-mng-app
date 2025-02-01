import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const generateJWTToken = (userId: mongoose.Types.ObjectId): string => {
  const payload = {
    sub: userId,
    expiresIn: 1440, //  1day in mins
  };
  return jwt.sign(payload, process.env.JWT_SECREAT || 'test');
};
