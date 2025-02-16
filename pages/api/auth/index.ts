import dbConnect from '@/lib/dbConnect';
import { generateJWTToken } from '@/lib/generateToken';
import { verifyToken } from '@/lib/verifyToken';
import User from '@/models/users/user.model';
import { serialize } from 'cookie';
import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  await dbConnect();
  switch (method) {
    case 'POST':
      try {
        const { email, password } = req.body;
        if (!email || !password) {
          return res.status(400).send({
            success: false,
            message: 'Please enter email and password',
          });
        }
        const user = await User.findOne({ email }).lean();
        if (!user) {
          return res.status(404).send({
            success: false,
            message: 'Account not found',
          });
        }
        const isMatch = user.password === password;
        if (!isMatch) {
          return res.status(404).send({
            success: false,
            message: 'Incorrect password',
          });
        }
        const token = generateJWTToken(user._id as mongoose.Types.ObjectId);

        res.setHeader(
          'Set-Cookie',
          serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
          })
        );
        return res
          .status(200)
          .send({ success: true, data: { ...user, token } });
      } catch (error) {
        return res.status(500).send({
          success: false,
          message: 'Something went wrong. Please try again!',
        });
      }
    case 'GET': // Verify Token
      try {
        const token = req.cookies.token;
        if (!token) throw new Error('No token');

        const decoded = verifyToken(token);
        if (!decoded.sub) throw new Error('Invalid token payload');

        const user = await User.findById(decoded.sub)
          .select('-password')
          .lean();
        if (!user) throw new Error('User not found');

        return res.status(200).json({
          success: true,
          data: user,
        });
      } catch (error) {
        return res.status(401).json({
          success: false,
          message:
            error instanceof Error ? error.message : 'Authentication failed',
          redirectToLogin: true,
        });
      }

    case 'DELETE': // Logout
      res.setHeader(
        'Set-Cookie',
        serialize('token', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          expires: new Date(0), // Expire immediately
          sameSite: 'strict',
          path: '/',
        })
      );
      return res
        .status(200)
        .json({ success: true, message: 'Logged out successfully' });

    default:
      res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
      return res
        .status(405)
        .json({ success: false, message: `Method ${method} not allowed.` });
  }
}

export default handler;
