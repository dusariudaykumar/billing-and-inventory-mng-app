import { Inventory as InventoryInterface } from '@/models/inventory/interface';
import Inventory from '@/models/inventory/inventory.model';
import mongoose from 'mongoose';

export const getAllItemsFromInventory = async (
  query: object,
  page: number,
  limit: number
) => {
  const items = await Inventory.find({ isActive: true, ...query })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const count = await Inventory.countDocuments();
  return {
    items,
    totalPages: Math.ceil(count / limit - 1),
    totalResults: count,
    currentPage: page,
  };
};

export const getInventoryItemById = async (id: mongoose.Types.ObjectId) => {
  try {
    return await Inventory.findById(id);
  } catch (error: any) {
    throw new Error(`Error fetching inventory item: ${error?.message}`);
  }
};

export const addNewItemToInventory = async (payload: InventoryInterface) => {
  const item = await Inventory.create(payload);
  return item;
};

export const isInventoryItemExists = async (itemName: string) => {
  const isExists = await Inventory.findOne({ name: itemName });
  return !!isExists;
};

export const updateInventoryItem = async (
  id: mongoose.Types.ObjectId,
  payload: Partial<InventoryInterface>
) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true, runValidators: true }
    );
    return updatedItem;
  } catch (error: any) {
    throw new Error(`Error updating inventory item: ${error?.message}`);
  }
};

export const deleteInventoryItemById = async (id: mongoose.Types.ObjectId) => {
  try {
    await Inventory.findByIdAndUpdate(id, { $set: { isActive: false } });
  } catch (error: any) {
    throw new Error(`Error deleting invoice: ${error?.message}`);
  }
};
