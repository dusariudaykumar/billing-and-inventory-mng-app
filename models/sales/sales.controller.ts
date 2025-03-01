import logger from '@/lib/logger';
import { textToMongoRegExpStatements } from '@/lib/mongo-funs';
import { ISales } from '@/models/sales/interface';
import _ from 'lodash';
import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import * as salesService from './sales.service';

export const handleGetSales = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    let baseQuery: object = {};
    const { page = 1, limit = 10, search } = req.query;

    const searchProps = [
      'customerInfo.name',
      'customerInfo.email',
      'customerInfo.phone',
    ];

    if (typeof search === 'string') {
      baseQuery = {
        $or: _.chain(searchProps)
          .map((props) => textToMongoRegExpStatements(props, search))
          .flatten()
          .filter(Boolean)
          .value(),
      };
    }
    const salesData = await salesService.getAllSales(
      baseQuery,
      Number(limit),
      Number(page)
    );
    return res.status(200).json({ success: true, data: salesData });
  } catch (error) {
    logger(error, 'Sales API Error:');
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again',
    });
  }
};

export const handleCreateInvoice = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const payload = req.body as ISales;
    if (!payload || !payload.items?.length || !payload.customerId) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing',
      });
    }

    const invoice = await salesService.createInvoice(payload);
    return res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    logger(error, 'Error while creating invoice');
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
};

export const handleGetInvoice = async (
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
    const sales = await salesService.getSalesById(objId);
    return res.status(200).json({ success: true, data: sales });
  } catch (error) {
    logger(error, 'Sales API Error:');
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again',
    });
  }
};
