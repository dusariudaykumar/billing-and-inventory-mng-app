import { serialize } from 'cookie';
import dbConnect from 'lib/dbConnect';
import { generateJWTToken } from 'lib/generateToken';
import logger from 'lib/logger';
import User from 'models/users/user.model';
import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { email, password } = await req.body;

  if (!email || !password) {
    return res.status(400).send({
      success: false,
      message: 'Please enter email and password',
    });
  }

  try {
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

    return res.status(200).send({ success: true, data: { ...user, token } });
  } catch (error) {
    logger(error);
    return res.status(500).send({
      success: false,
      message: 'Something went wrong. Please try again!',
    });
  }
}
