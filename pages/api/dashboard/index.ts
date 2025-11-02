import { withAuth } from '@/middleware/with-auth-api-middleware';
import { getDashboardData } from '@/models/dashboard/dashboard.controller';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getDashboardData(req, res);
    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({
        success: false,
        message: `Method ${req.method} is not allowed.`,
      });
  }
}

export default withAuth(handler);
