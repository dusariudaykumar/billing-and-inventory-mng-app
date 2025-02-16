import logger from 'lib/logger';

import { NextApiRequest, NextApiResponse } from 'next';

import { withAuth } from '@/middleware/with-auth-api-middleware';
import {
  createSupplier,
  getAllSuppliers,
  isSupplierExists,
} from '@/models/suppliers/supplier.service';
import { ISupplier } from '@/models/suppliers/interface';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;

  switch (method) {
    case 'GET':
      try {
        const suppliers = await getAllSuppliers();
        return res.status(200).json({ success: true, data: suppliers });
      } catch (e) {
        logger(e);
        return res.status(500).json({
          success: false,
          message: 'Somthing went wrong. Please try again',
        });
      }
    case 'POST': // create supplier
      try {
        const payload = body as ISupplier;
        if (
          !payload ||
          !payload.companyName ||
          !payload.contactDetails ||
          !payload.name
        ) {
          return res
            .status(400)
            .send({ success: false, message: 'Required fields are missing' });
        }

        // check if supplier already exists
        const isExist = await isSupplierExists(
          payload.name,
          payload.companyName
        );

        if (!isExist) {
          const newSupplier = await createSupplier(payload);
          return res.status(201).send({
            success: true,
            data: newSupplier,
            message: 'Successfully created supplier!',
          });
        }
        return res
          .status(400)
          .send({ success: false, message: 'Supplier already exists' });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: 'Somthing went wrong. Please try again',
        });
      }
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).send(`Method ${method} is not allowed.`);
      break;
  }
}

export default withAuth(handler);
