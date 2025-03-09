import { textToMongoRegExpStatements } from '@/lib/mongo-funs';
import { ISupplier } from '@/models/suppliers/interface';
import * as supplierService from '@/models/suppliers/supplier.service';
import logger from 'lib/logger';
import _ from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Handles fetching all suppliers.
 */
export const handleGetSuppliers = async (
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

    const suppliers = await supplierService.getAllSuppliers(
      baseQuery,
      Number(limit),
      Number(page)
    );
    return res.status(200).json({ success: true, data: suppliers });
  } catch (error) {
    logger(error, 'Error while fetching suppliers');
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};

/**
 * Handles creating a new supplier.
 */
export const handleCreateSupplier = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const payload = req.body as ISupplier;

    if (
      !payload ||
      !payload.companyName ||
      !payload.contactDetails ||
      !payload.name
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'Required fields are missing.' });
    }

    const isExist = await supplierService.isSupplierExists(
      payload.name,
      payload.companyName
    );

    if (isExist) {
      return res
        .status(400)
        .json({ success: false, message: 'Supplier already exists.' });
    }

    const newSupplier = await supplierService.createSupplier(payload);
    return res.status(201).json({
      success: true,
      data: newSupplier,
      message: 'Supplier created successfully!',
    });
  } catch (error) {
    logger(error, 'Error while creating supplier');
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};

/**
 * Handles updating a supplier by ID.
 */
export const handleUpdateSupplier = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { id } = req.query;
    const payload = req.body as Partial<ISupplier>;

    if (!id || typeof id !== 'string') {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid ID provided.' });
    }

    const updatedSupplier = await supplierService.updateSupplier(id, payload);

    if (!updatedSupplier) {
      return res
        .status(404)
        .json({ success: false, message: 'Supplier not found.' });
    }

    return res.status(200).json({
      success: true,
      data: updatedSupplier,
      message: 'Supplier updated successfully.',
    });
  } catch (error) {
    logger(error, 'Error while updating supplier');
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};

/**
 * Handles deleting a supplier by ID.
 */
export const handleDeleteSupplier = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid ID provided.' });
    }

    const deletedSupplier = await supplierService.deleteSupplier(id);

    if (!deletedSupplier) {
      return res
        .status(404)
        .json({ success: false, message: 'Supplier not found.' });
    }

    return res
      .status(200)
      .json({ success: true, message: 'Supplier deleted successfully.' });
  } catch (error) {
    logger(error, 'Error while deleting supplier');
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};
