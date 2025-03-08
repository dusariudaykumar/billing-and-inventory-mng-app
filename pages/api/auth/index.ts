import dbConnect from '@/lib/dbConnect';
import {
  handleLogin,
  handleLogout,
  handleSignup,
  handleVerifyToken,
} from '@/models/users/user.controller';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  switch (req.method) {
    case 'POST': // Login
      return handleLogin(req, res);
    case 'PUT': // Signup
      return handleSignup(req, res);
    case 'GET': // Verify Token
      return handleVerifyToken(req, res);
    case 'DELETE': // Logout
      return handleLogout(req, res);
    default:
      res.setHeader('Allow', ['POST', 'PUT', 'GET', 'DELETE']);
      return res
        .status(405)
        .json({ success: false, message: `Method ${req.method} not allowed.` });
  }
}

export default handler;
