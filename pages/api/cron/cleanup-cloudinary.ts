import { deleteOldFiles } from '@/lib/cloudinary';
import logger from '@/lib/logger';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Optional: Check for CRON_SECRET if you want to secure it
  // const { CRON_SECRET } = process.env;
  // if (req.headers.authorization !== `Bearer ${CRON_SECRET}`) {
  //   return res.status(401).end('Unauthorized');
  // }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    logger('[Cron Cleanup] Starting scheduled cleanup...');
    const days = parseInt(process.env.CLOUDINARY_CLEANUP_DAYS || '7', 10);
    const result = await deleteOldFiles(days);

    res.status(200).json({
      success: true,
      message: 'Cleanup job completed',
      data: result,
    });
  } catch (error: any) {
    logger(error, '[Cron Cleanup] Failed:');
    res.status(500).json({
      success: false,
      message: error.message || 'Cleanup failed',
    });
  }
}
