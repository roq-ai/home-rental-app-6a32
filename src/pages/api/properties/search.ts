import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const fiftyKmLatitudeOffset = 0.4491555875; // 
  const fiftyKmLongitudeOffset = 0.5986; // 
  

  if (req.method == "GET") {
    const data = await prisma.property.findMany({
      where: {
        AND: [
          {
            latitude: {
              gte: (
                parseFloat(req.query.latitude as string) - fiftyKmLatitudeOffset
              ).toString(),
            },
          },
          {
            latitude: {
              lte: (
                parseFloat(req.query.latitude as string) + fiftyKmLatitudeOffset
              ).toString(),
            },
          },
          {
            longitude: {
              gte: (
                parseFloat(req.query.longitude as string) - fiftyKmLongitudeOffset
              ).toString(),
            },
          },
          {
            longitude: {
              lte: (
                parseFloat(req.query.longitude as string) + fiftyKmLongitudeOffset
              ).toString(),
            },
          },
        ],
      },
    });
    
    return res.status(200).json(data);
  }
}
