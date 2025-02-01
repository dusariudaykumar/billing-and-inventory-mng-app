import logger from 'lib/logger';
import { withAuth } from '@/middleware/with-auth-api-middleware';
import {
  createCustomer,
  getAllCustomers,
  isCustomerExists,
} from 'models/customers/customer.service';
import { ICustomer } from 'models/customers/interface';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;

  switch (method) {
    case 'GET':
      try {
        const customers = await getAllCustomers();
        return res.status(200).json({ success: true, data: customers });
      } catch (e) {
        logger(e);
        return res.status(500).json({
          success: false,
          message: 'Somthing went wrong. Please try again',
        });
      }
    case 'POST': // create customer
      try {
        const payload = body as ICustomer;
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

        // check if customer already exists
        const isExist = await isCustomerExists(
          payload.name,
          payload.companyName
        );

        if (!isExist) {
          const newCustomer = await createCustomer(payload);
          return res.status(201).send({ success: true, data: newCustomer });
        }
        return res
          .status(400)
          .send({ success: false, data: 'Customer already exists' });
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
