import mongoose from 'mongoose';

/**
 * Helper function to convert storeId string to ObjectId
 * Throws error if storeId is invalid
 */
export const convertStoreIdToObjectId = (
  storeId: string
): mongoose.Types.ObjectId => {
  if (!storeId) {
    throw new Error('Store ID is required');
  }

  try {
    return new mongoose.Types.ObjectId(storeId);
  } catch (error) {
    throw new Error('Invalid Store ID format');
  }
};
