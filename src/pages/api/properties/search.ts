import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const fiftyKmLatitudeOffset = 0.4491555875;
const fiftyKmLongitudeOffset = 0.5986;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const latitude = parseFloat(req.query.latitude as string);
    const longitude = parseFloat(req.query.longitude as string);

    const latitudeOffset = latitude >= 0 ? fiftyKmLatitudeOffset : -fiftyKmLatitudeOffset;
    const longitudeOffset = longitude >= 0 ? fiftyKmLongitudeOffset : -fiftyKmLongitudeOffset;

    const properties = await prisma.property.findMany({
      where: {
        latitude: {
          gte: String(latitude - latitudeOffset),
          lte: String(latitude + latitudeOffset),
        },
        longitude: {
          gte: String(longitude - longitudeOffset),
          lte: String(longitude + longitudeOffset),
        },
      },
    });

    console.log({ properties });

    return res.status(200).json(properties);
  }
}
