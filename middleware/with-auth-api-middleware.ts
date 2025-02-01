import { verifyToken } from '@/lib/verifyToken';
import { serialize } from 'cookie';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dbConnect from 'lib/dbConnect';
import logger from 'lib/logger';
import User from 'models/users/user.model';
import { NextApiRequest, NextApiResponse } from 'next';

type Handler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

export const withAuth = (handler: Handler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await dbConnect();

      const token = req.cookies.token;

      if (!token) {
        throw new Error('Please login again');
      }

      const decoded = verifyToken(token);

      if (!decoded.sub) {
        throw new Error('Invalid token');
      }

      const user = await User.findById(decoded.sub);
      if (!user) {
        throw new Error('User not found');
      }

      // add user to request object
      req.user = user;

      return handler(req, res);
    } catch (error) {
      logger(error, '--Middleware Error');

      /** remove token from cookie */
      res.setHeader(
        'Set-Cookie',
        serialize('token', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          expires: new Date(0),
          sameSite: 'strict',
          path: '/',
        })
      );

      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Server error',
        redirectToLogin: true,
      });
    }
  };
};
