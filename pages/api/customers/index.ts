import { withAuth } from '@/middleware/with-auth-api-middleware';
import {
  createCustomerHandler,
  deleteCustomerHandler,
  getCustomerDetailsHandler,
  getCustomersHandler,
  getCustomerUnpaidInvoicesHandler,
  updateCustomerHandler,
} from '@/models/customers/customer.controller';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      if (req.query.id && req.query.unpaidInvoices === 'true') {
        return getCustomerUnpaidInvoicesHandler(req, res);
      }

      if (req.query.id) {
        return getCustomerDetailsHandler(req, res);
      }
      return getCustomersHandler(req, res);

    case 'POST':
      return createCustomerHandler(req, res);

    case 'PUT':
      return updateCustomerHandler(req, res);

    case 'DELETE':
      return deleteCustomerHandler(req, res);

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).send({
        success: false,
        message: `Method ${req.method} is not allowed.`,
      });
  }
}

export default withAuth(handler);
