import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  switch (method) {
    case 'GET':
      return res.status(200).json({ message: 'Pong' });
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).send(`Method ${method} is not allowed.`);
      break;
  }
}

export default handler;
