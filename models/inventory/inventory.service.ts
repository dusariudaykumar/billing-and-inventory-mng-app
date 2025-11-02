import { Inventory as InventoryInterface } from '@/models/inventory/interface';
import Inventory from '@/models/inventory/inventory.model';
import mongoose from 'mongoose';

export const getAllItemsFromInventory = async (
  storeId: mongoose.Types.ObjectId,
  query: object,
  page: number,
  limit: number
) => {
  const filter = { isActive: true, storeId, ...query };
  const items = await Inventory.find(filter)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const count = await Inventory.countDocuments(filter);

  return {
    items,
    totalPages: Math.ceil(count / limit),
    totalResults: count,
    currentPage: page,
  };
};

export const getInventoryItemById = async (
  storeId: mongoose.Types.ObjectId,
  id: mongoose.Types.ObjectId
) => {
  try {
    return await Inventory.findOne({ _id: id, storeId });
  } catch (error: any) {
    throw new Error(`Error fetching inventory item: ${error?.message}`);
  }
};

export const addNewItemToInventory = async (
  storeId: mongoose.Types.ObjectId,
  payload: InventoryInterface
) => {
  const item = await Inventory.create({ ...payload, storeId });
  return item;
};

export const isInventoryItemExists = async (
  storeId: mongoose.Types.ObjectId,
  itemName: string
) => {
  const isExists = await Inventory.findOne({ storeId, name: itemName });
  return !!isExists;
};

export const updateInventoryItem = async (
  storeId: mongoose.Types.ObjectId,
  id: mongoose.Types.ObjectId,
  payload: Partial<InventoryInterface>
) => {
  try {
    const updatedItem = await Inventory.findOneAndUpdate(
      { _id: id, storeId },
      { $set: payload },
      { new: true, runValidators: true }
    );
    return updatedItem;
  } catch (error: any) {
    throw new Error(`Error updating inventory item: ${error?.message}`);
  }
};

export const deleteInventoryItemById = async (
  storeId: mongoose.Types.ObjectId,
  id: mongoose.Types.ObjectId
) => {
  try {
    await Inventory.findOneAndUpdate(
      { _id: id, storeId },
      { $set: { isActive: false } }
    );
  } catch (error: any) {
    throw new Error(`Error deleting invoice: ${error?.message}`);
  }
};
