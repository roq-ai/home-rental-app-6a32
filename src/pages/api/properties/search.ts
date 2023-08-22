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

    let startDate = new Date(req.query.startDate as string);
    let endDate = new Date(req.query.endDate as string);
    const maxGuest = (req.query.maxGuest as string) || 0;
    if (isNaN(startDate.getTime())) {
      startDate = new Date(); 
    }

    if (isNaN(endDate.getTime())) {
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7); 
    }

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
        booking: {
          none: {
            AND: [
              {
                OR: [
                  {
                    start_date: {
                      lte: endDate,
                      gte: startDate,
                    },
                  },
                  {
                    end_date: {
                      lte: endDate,
                      gte: startDate,
                    },
                  },
                ],
              },
              {
                num_of_guest: {
                  lte: maxGuest.toString(),
                },
              },
            ],
          },
        },
      },
    });
    console.log({properties})
    
    return res.status(200).json(properties);
  }
}