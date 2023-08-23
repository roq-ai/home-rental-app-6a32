import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const fiftyKmLatitudeOffset = 0.4491555875; 
  const fiftyKmLongitudeOffset = 0.5986; 

  if (req.method === "GET") {
    const latitude = parseFloat(req.query.latitude as string);
    const longitude = parseFloat(req.query.longitude as string);

    const startDate = new Date(req.query.startDate as string);
    const endDate = new Date(req.query.endDate as string);

    const properties = await prisma.property.findMany({
      where: {
        AND: [
          {
            latitude: {
              gte: (latitude - fiftyKmLatitudeOffset).toString(),
              lte: (latitude + fiftyKmLatitudeOffset).toString(),
            },
          },
          {
            longitude: {
              gte: (longitude - fiftyKmLongitudeOffset).toString(),
              lte: (longitude + fiftyKmLongitudeOffset).toString(),
            },
          },
        ],
      },
      include: {
        booking: {
          where: {
            AND: [
              {
                start_date: {
                  lte: startDate ,
                },
              },
              {
                end_date: {
                  gte: endDate ,
                },
              },
              {
                num_of_guest: {
                  gte: req.query.maxGuest as string,
                },
              },
            ],
          },
        },
      },
    });
    
    return res.status(200).json(properties);
  }
}
