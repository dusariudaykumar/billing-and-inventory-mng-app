import { textToMongoRegExpStatements } from '@/lib/mongo-funs';
import { Inventory as InventoryInterface } from '@/models/inventory/interface';
import {
  addNewItemToInventory,
  deleteInventoryItemById,
  getAllItemsFromInventory,
  getInventoryItemById,
  isInventoryItemExists,
  updateInventoryItem,
} from '@/models/inventory/inventory.service';
import logger from 'lib/logger';
import _ from 'lodash';
import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Handles fetching all inventory items with optional search and pagination.
 */
export const getInventoryHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    let baseQuery: object = {};
    const { page = 1, limit = 10, search } = req.query;

    const searchProps = ['name'];

    if (typeof search === 'string') {
      const searchQuery = _.chain(searchProps)
        .map((prop) => textToMongoRegExpStatements(prop, search))
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
  } catch (error) {
    logger(error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};

/**
 * Handles adding a new inventory item.
 */
export const addInventoryItemHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const payload = req.body as InventoryInterface;

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

    // Check if item already exists in the inventory
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
      message: 'Item already exists in the inventory.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};

/**
 * Handles updating an inventory item by ID.
 */
export const updateInventoryItemHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { id } = req.query;
    const payload = req.body;

    if (!id || typeof id !== 'string')
      return res.status(400).json({
        success: false,
        message: 'Invalid ID.',
      });

    const objId = new mongoose.Types.ObjectId(id as string);

    // Check if item exists
    const existingItem = await getInventoryItemById(objId);
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.',
      });
    }

    // Update the item
    const updatedItem = await updateInventoryItem(objId, payload);
    return res.status(200).json({
      success: true,
      data: updatedItem,
      message: 'Item updated successfully.',
    });
  } catch (error) {
    logger(error, 'Inventory API Error:');
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again',
    });
  }
};

export const deleteInventoryItemByIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { id } = req.query;
    if (!id || typeof id !== 'string')
      return res.status(400).json({
        success: false,
        message: 'Invaild ID.',
      });
    const objId = new mongoose.Types.ObjectId(id as string);
    await deleteInventoryItemById(objId);
    return res
      .status(200)
      .json({ success: true, message: 'Item removed successfully.' });
  } catch (error) {
    logger(error, 'Sales API Error:');
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again',
    });
  }
};
