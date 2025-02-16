import { textToMongoRegExpStatements } from '@/lib/mongo-funs';
import { withAuth } from '@/middleware/with-auth-api-middleware';
import { Inventory as InvetoryInterface } from '@/models/inventory/interface';
import {
  addNewItemToInventory,
  getAllItemsFromInventory,
  isInventoryItemExists,
} from '@/models/inventory/inventory.service';
import logger from 'lib/logger';
import _ from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, query } = req;

  switch (method) {
    case 'GET':
      try {
        let baseQuery: object = {};
        const { page = 1, limit = 10, search } = query;

        const searchProps = ['name'];

        if (typeof search === 'string') {
          const searchQuery = _.chain(searchProps)
            .map((props) => textToMongoRegExpStatements(props, search))
            .flatten()
            .filter((it) => !!it)
            .value();
          baseQuery = { $or: searchQuery };
        }

        const inventory = await getAllItemsFromInventory(
          baseQuery,
          Number(page),
          Number(limit)
        );
        return res.status(200).json({ success: true, data: inventory });
      } catch (e) {
        logger(e);
        return res.status(500).json({
          success: false,
          message: 'Somthing went wrong. Please try again',
        });
      }
    case 'POST': // create Item
      try {
        const payload = body as InvetoryInterface;
        if (
          !payload ||
          !payload.name ||
          !payload.purchasePrice ||
          !payload.sellingPrice ||
          !payload.units
        ) {
          return res
            .status(400)
            .send({ success: false, message: 'Required fields are missing.' });
        }

        // check if item already exists in the inventory
        const isExist = await isInventoryItemExists(payload.name);

        if (!isExist) {
          const item = await addNewItemToInventory(payload);
          return res.status(201).send({
            success: true,
            data: item,
            message: 'Successfully added new item.',
          });
        }
        return res.status(400).send({
          success: false,
          messsage: 'Item already exists in the inventory.',
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: 'Somthing went wrong. Please try again.',
        });
      }
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).send(`Method ${method} is not allowed.`);
      break;
  }
}

export default withAuth(handler);
