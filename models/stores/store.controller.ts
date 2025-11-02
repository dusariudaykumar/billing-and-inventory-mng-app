import logger from '@/lib/logger';
import { NextApiRequest, NextApiResponse } from 'next';
import { createStore, getAllStores, getStoreById } from './store.service';

/**
 * Get all stores or a specific store
 */
export const getStoresHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    if (req.query.id) {
      const store = await getStoreById(req.query.id as string);
      if (!store) {
        return res.status(404).json({
          success: false,
          message: 'Store not found',
        });
      }
      return res.status(200).json({ success: true, data: store });
    }

    const stores = await getAllStores();
    return res.status(200).json({ success: true, data: stores });
  } catch (error: any) {
    logger(error, 'Error fetching stores');
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};

/**
 * Create a new store
 */
export const createStoreHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { name, code, address, contactDetails } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: 'Name and code are required',
      });
    }

    const store = await createStore({
      name,
      code,
      address,
      contactDetails,
      isActive: true,
    });

    return res.status(201).json({ success: true, data: store });
  } catch (error: any) {
    logger(error, 'Error creating store');
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Store code already exists',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};
