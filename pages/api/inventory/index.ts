import { withAuth } from '@/middleware/with-auth-api-middleware';
import {
  addInventoryItemHandler,
  deleteInventoryItemByIdHandler,
  getInventoryHandler,
} from '@/models/inventory/inventory.controller';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getInventoryHandler(req, res);

    case 'POST':
      return addInventoryItemHandler(req, res);

    case 'DELETE':
      return deleteInventoryItemByIdHandler(req, res);

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).send({
        success: false,
        message: `Method ${req.method} is not allowed.`,
      });
  }
}

export default withAuth(handler);
