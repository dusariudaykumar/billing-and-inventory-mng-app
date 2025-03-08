import { withAuth } from '@/middleware/with-auth-api-middleware';
import * as salesControllers from '@/models/sales/sales.controller';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return req.query.id
        ? salesControllers.handleGetInvoice(req, res)
        : salesControllers.handleGetSales(req, res);
    case 'POST':
      return salesControllers.handleCreateInvoice(req, res);
    case 'PUT':
      return salesControllers.handleUpdateInvoice(req, res);
    case 'DELETE':
      return salesControllers.handleDeleteInvoiceById(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({
        success: false,
        message: `Method ${req.method} is not allowed.`,
      });
  }
}

export default withAuth(handler);
