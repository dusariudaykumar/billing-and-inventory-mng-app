import dbConnect from 'lib/dbConnect';
import logger from 'lib/logger';
import User from 'models/users/user.model';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const users = await User.find({});
        res.status(200).json({ success: true, data: users });
      } catch (e) {
        logger(e);
        res.status(404).json({
          success: false,
          message: 'users search could not be performed.',
        });
      }
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).send(`Method ${method} is not allowed.`);
      break;
  }
}
