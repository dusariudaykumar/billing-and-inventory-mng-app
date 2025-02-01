import dbConnect from '@/lib/dbConnect';
import logger from '@/lib/logger';
import { verifyToken } from '@/lib/verifyToken';
import User from 'models/users/user.model';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const token = req.cookies.token;
    if (!token) throw new Error('No token');

    const decoded = verifyToken(token);
    logger(decoded);
    if (!decoded.sub) throw new Error('Invalid token payload');

    await dbConnect();

    const user = await User.findById(decoded.sub).select('-password').lean();
    logger(user);
    if (!user) throw new Error('User not found');

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger(error);
    return res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : 'Authentication failed',
      redirectToLogin: true,
    });
  }
}
