import { withAuth } from '@/middleware/with-auth-api-middleware';
import * as supplierControllers from '@/models/suppliers/supplier.controller';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return supplierControllers.handleGetSuppliers(req, res);
    case 'POST':
      return supplierControllers.handleCreateSupplier(req, res);
    case 'PUT':
      return supplierControllers.handleUpdateSupplier(req, res);
    case 'DELETE':
      return supplierControllers.handleDeleteSupplier(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({
        success: false,
        message: `Method ${req.method} is not allowed.`,
      });
  }
}

export default withAuth(handler);
