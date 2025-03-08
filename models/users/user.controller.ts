import { verifyToken } from '@/lib/verifyToken';
import { serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  authenticateUser,
  getUserFromToken,
  registerUser,
} from './user.service';

/**
 * Handle Login
 */
export const handleLogin = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Please enter email and password' });
    }

    const { user, token } = await authenticateUser(email, password);

    res.setHeader(
      'Set-Cookie',
      serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })
    );

    return res.status(200).json({ success: true, data: { ...user, token } });
  } catch (error: any) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

/**
 * Handle Signup (Restricted to Approved Emails)
 */
export const handleSignup = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter name, email, and password',
      });
    }

    await registerUser(name, email, password);
    return res.status(201).json({
      success: true,
      message: 'Signup successful! You can now log in.',
    });
  } catch (error: any) {
    return res.status(403).json({ success: false, message: error.message });
  }
};

/**
 * Handle Token Verification
 */
export const handleVerifyToken = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const token = req.cookies.token;
    if (!token) throw new Error('No token');

    const decoded = verifyToken(token);
    const user = await getUserFromToken(decoded.sub as string);
    if (!user) throw new Error('User not found');

    return res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

/**
 * Handle Logout
 */
export const handleLogout = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
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
  return res
    .status(200)
    .json({ success: true, message: 'Logged out successfully' });
};
