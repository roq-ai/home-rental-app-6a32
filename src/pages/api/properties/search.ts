import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == 'GET') {
    const data = await prisma.property.findMany({
      where: {
        OR: [
          {
            location: {
              contains: req.query.location as string,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
    return res.status(200).json(data);
  }
}
