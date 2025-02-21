import { withAuth } from '@/middleware/with-auth-api-middleware';
import { NextApiRequest, NextApiResponse } from 'next';
import * as salesControllers from '../../../models/sales/sales.controller';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      if (id) {
        // get sales by ID
        return await salesControllers.handleGetInvoice(req, res);
      } else {
        return await salesControllers.handleGetSales(req, res);
      }
    case 'POST': // create sales
      return await salesControllers.handleCreateInvoice(req, res);
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).send(`Method ${method} is not allowed.`);
      break;
  }
}

export default withAuth(handler);
