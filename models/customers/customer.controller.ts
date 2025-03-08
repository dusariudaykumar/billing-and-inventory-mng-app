import { textToMongoRegExpStatements } from '@/lib/mongo-funs';
import logger from 'lib/logger';
import _ from 'lodash';
import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomerById,
  isCustomerExists,
  updateCustomer,
} from 'models/customers/customer.service';
import { ICustomer } from 'models/customers/interface';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Handles fetching all customers with optional search and pagination.
 */
export const getCustomersHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    let baseQuery: object = {};
    const { page = 1, limit = 10, search } = req.query;

    const searchProps = ['name', 'companyName'];

    if (typeof search === 'string') {
      const searchQuery = _.chain(searchProps)
        .map((prop) => textToMongoRegExpStatements(prop, search))
        .flatten()
        .filter(Boolean)
        .value();
      baseQuery = { $or: searchQuery };
    }

    const customers = await getAllCustomers(
      baseQuery,
      Number(limit),
      Number(page)
    );
    return res.status(200).json({ success: true, data: customers });
  } catch (error) {
    logger(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};

/**
 * Handles creating a new customer.
 */
export const createCustomerHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const payload = req.body as ICustomer;

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

    // Check if customer already exists
    const isExist = await isCustomerExists(payload.name, payload.companyName);

    if (!isExist) {
      const newCustomer = await createCustomer(payload);
      return res.status(201).send({ success: true, data: newCustomer });
    }

    return res
      .status(400)
      .send({ success: false, message: 'Customer already exists' });
  } catch (error) {
    logger(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};

/**
 * Handles updating an existing customer.
 */
export const updateCustomerHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { id } = req.query;
    const payload = req.body as Partial<ICustomer>;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: 'Customer ID is required' });
    }

    const existingCustomer = await getCustomerById(id as string);
    if (!existingCustomer) {
      return res
        .status(404)
        .json({ success: false, message: 'Customer not found' });
    }

    const updatedCustomer = await updateCustomer(id as string, payload);
    return res.status(200).json({ success: true, data: updatedCustomer });
  } catch (error) {
    logger(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};

/**
 * Handles deleting a customer by ID.
 */
export const deleteCustomerHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: 'Customer ID is required' });
    }

    const existingCustomer = await getCustomerById(id as string);
    if (!existingCustomer) {
      return res
        .status(404)
        .json({ success: false, message: 'Customer not found' });
    }

    await deleteCustomer(id as string);
    return res
      .status(200)
      .json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    logger(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};
