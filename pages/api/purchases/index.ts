import { withAuth } from '@/middleware/with-auth-api-middleware';
import {
  handleCreatePurchase,
  handleDeletePurchase,
  handleGetPurchaseById,
  handleGetPurchases,
  handleUpdatePurchase,
} from '@/models/purchases/purchases.controller';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return req.query.id
        ? handleGetPurchaseById(req, res)
        : handleGetPurchases(req, res);
    case 'POST':
      return handleCreatePurchase(req, res);
    case 'PUT':
      return handleUpdatePurchase(req, res);
    case 'DELETE':
      return handleDeletePurchase(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res
        .status(405)
        .json({ success: false, message: `Method ${req.method} not allowed.` });
  }
}

export default withAuth(handler);
