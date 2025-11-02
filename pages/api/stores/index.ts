import { withAuth } from '@/middleware/with-auth-api-middleware';
import {
  createStoreHandler,
  getStoresHandler,
} from '@/models/stores/store.controller';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getStoresHandler(req, res);
    case 'POST':
      return createStoreHandler(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({
        success: false,
        message: `Method ${req.method} is not allowed.`,
      });
  }
}

export default withAuth(handler);
