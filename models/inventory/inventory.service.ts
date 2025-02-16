import { Inventory as InventoryInterface } from '@/models/inventory/interface';
import Inventory from '@/models/inventory/inventory.model';

export const getAllItemsFromInventory = async (
  query: object,
  page: number,
  limit: number
) => {
  const items = await Inventory.find({ ...query })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const count = await Inventory.countDocuments();
  return {
    items,
    totalPages: Math.ceil(count / limit),
    totalResults: count,
    currentPage: page,
  };
};

export const addNewItemToInventory = async (payload: InventoryInterface) => {
  const item = await Inventory.create(payload);
  return item;
};

export const isInventoryItemExists = async (itemName: string) => {
  const isExists = await Inventory.findOne({ name: itemName });
  return !!isExists;
};
