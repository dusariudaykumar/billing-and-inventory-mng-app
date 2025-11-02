import dbConnect from '@/lib/dbConnect';
import Store from '@/models/stores/store.model';
import { NextApiRequest, NextApiResponse } from 'next';

const stores = [
  {
    name: 'Pedda Amberpet',
    code: 'SRD-01',
    address:
      'Plot No: 297, Baljaguda Road, Near by Four Ways Trading Solutions, Pedda Amberpet, Hyderabad, Telangana State - 501 505.',
    contactDetails: {
      phone: '97015555539',
      email: 'srirangarockdrill@gmail.com',
    },
    isActive: true,
  },
  {
    name: 'Srikakulam',
    code: 'SRD-02',
    address:
      'Beside Harshitha Traders, Kotta Road, Junction Service Road, Dist: Srikakulam - 532 001, A.P',
    contactDetails: {
      phone: '9533388880',
      email: 'srirangarockdrill@gmail.com',
    },
    isActive: true,
  },
];

/**
 * Seed stores endpoint - POST /api/stores/seed
 * This will create the two stores if they don't already exist
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST.',
    });
  }

  try {
    await dbConnect();

    // Check if stores already exist
    const existingStores = await Store.find({});

    if (existingStores.length > 0) {
      return res.status(200).json({
        success: true,
        message: `Found ${existingStores.length} existing store(s). Skipping seed.`,
        data: existingStores,
      });
    }

    // Create stores
    const createdStores = await Store.insertMany(stores);

    return res.status(201).json({
      success: true,
      message: `Successfully created ${createdStores.length} store(s)`,
      data: createdStores,
    });
  } catch (error: any) {
    console.error('Error seeding stores:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          'Duplicate store code detected. Some stores may already exist.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error seeding stores',
      error: error.message,
    });
  }
}
