import dbConnect from '@/lib/dbConnect';
import logger from '@/lib/logger';
import { verifyToken } from '@/lib/verifyToken';
import { NextApiRequest, NextApiResponse } from 'next';

export function withAuth(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await dbConnect();

      const token = req.cookies.token;
      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: 'Unauthorized' });
      }

      const decoded = verifyToken(token);
      req.user = decoded;
      return handler(req, res);
    } catch (error) {
      logger(error, 'Middleware error');
      return res
        .status(401)
        .json({ success: false, message: 'Invalid or expired token' });
    }
  };
}
