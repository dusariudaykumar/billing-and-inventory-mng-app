import { IStore } from '@/models/stores/store.interface';
import Store from './store.model';

/**
 * Get all active stores
 */
export const getAllStores = async () => {
  return await Store.find({ isActive: true }).sort({ name: 1 }).lean();
};

/**
 * Get store by ID
 */
export const getStoreById = async (id: string) => {
  return await Store.findById(id).lean();
};

/**
 * Create a new store
 */
export const createStore = async (payload: IStore) => {
  return await Store.create(payload);
};

/**
 * Check if store exists by code
 */
export const isStoreExists = async (code: string) => {
  return !!(await Store.findOne({ code }));
};
