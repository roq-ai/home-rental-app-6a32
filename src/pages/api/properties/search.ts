import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const oneKmLatitudeOffset = 0.00898311175; // 1km in degrees of latitude
  const oneKmLongitudeOffset = 0.011972; // 1km in degrees of longitude

  if (req.method == "GET") {
    const data = await prisma.property.findMany({
      where: {
        AND: [
          {
            latitude: {
              gte: (
                parseFloat(req.query.latitude as string) - oneKmLatitudeOffset
              ).toString(),
            },
          },
          {
            latitude: {
              lte: (
                parseFloat(req.query.latitude as string) + oneKmLatitudeOffset
              ).toString(),
            },
          },
          {
            longitude: {
              gte: (
                parseFloat(req.query.longitude as string) - oneKmLongitudeOffset
              ).toString(),
            },
          },
          {
            longitude: {
              lte: (
                parseFloat(req.query.longitude as string) + oneKmLongitudeOffset
              ).toString(),
            },
          },
        ],
      },
    });
    
    return res.status(200).json(data);
  }
}
