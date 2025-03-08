import { NextApiRequest, NextApiResponse } from 'next';
import {
  createPurchase,
  deletePurchase,
  getAllPurchases,
  getPurchaseById,
  updatePurchase,
} from './purchases.service';

/**
 * Handles creating a purchase
 */
export const handleCreatePurchase = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const payload = req.body;

    if (
      !payload.supplierId ||
      !payload.items ||
      !payload.amountPaid ||
      !payload.totalCost ||
      !payload.dueAmount
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'Required fields are missing.' });
    }

    const purchase = await createPurchase(payload);
    return res.status(201).json({ success: true, data: purchase });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};

/**
 * Handles getting all purchases
 */
export const handleGetPurchases = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const purchases = await getAllPurchases(Number(limit), Number(page));
    return res.status(200).json({ success: true, data: purchases });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};

/**
 * Handles getting a purchase by ID
 */
export const handleGetPurchaseById = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { id } = req.query;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: 'Purchase ID is required' });

    const purchase = await getPurchaseById(id as string);
    if (!purchase)
      return res
        .status(404)
        .json({ success: false, message: 'Purchase not found' });

    return res.status(200).json({ success: true, data: purchase });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};

/**
 * Handles updating a purchase
 */
export const handleUpdatePurchase = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { id } = req.query;
    const payload = req.body;

    if (!id)
      return res
        .status(400)
        .json({ success: false, message: 'Purchase ID is required' });

    const updatedPurchase = await updatePurchase(id as string, payload);
    if (!updatedPurchase)
      return res
        .status(404)
        .json({ success: false, message: 'Purchase not found' });

    return res.status(200).json({ success: true, data: updatedPurchase });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};

/**
 * Handles deleting a purchase
 */
export const handleDeletePurchase = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { id } = req.query;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: 'Purchase ID is required' });

    const deletedPurchase = await deletePurchase(id as string);
    if (!deletedPurchase)
      return res
        .status(404)
        .json({ success: false, message: 'Purchase not found' });

    return res
      .status(200)
      .json({ success: true, message: 'Purchase deleted successfully' });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};
