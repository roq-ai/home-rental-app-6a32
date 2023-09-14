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

    const latitudeOffset =
      latitude >= 0 ? fiftyKmLatitudeOffset : -fiftyKmLatitudeOffset;
    const longitudeOffset =
      longitude >= 0 ? fiftyKmLongitudeOffset : -fiftyKmLongitudeOffset;

    let result: any[];
    function generateDateRangeArray(startDate: any, endDate: any) {
      result = [];
      const currentDate = new Date(startDate);

      while (currentDate <= new Date(endDate)) {
        result.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return result;
    }

    const startDate = req?.query?.start_date;
    const endDate = req?.query?.end_date;
    const guestNumber = parseInt(req?.query?.num_of_guest as string) ;
    generateDateRangeArray(startDate, endDate);

    let typeOfSearch ;

    const seachByAllLocation = [
      {
        latitude: {
          gte: String(latitude - latitudeOffset),
          lte: String(latitude + latitudeOffset),
        },
        longitude: {
          gte: String(longitude - longitudeOffset),
          lte: String(longitude + longitudeOffset),
        },
      },
      {
        num_of_guest: {
          gte: guestNumber,
        },
      },
      {
        NOT: {
          booking: {
            some: {
              OR: result.map((date) => ({
                AND: [
                  { start_date: { lte: date } },
                  { end_date: { gte: date } },
                ],
              })),
            },
          },
        },
      },
    ]

    const searchForSpecificLocation = [
      
      {
        num_of_guest: {
          gte: guestNumber,
        },
      },
      {
        NOT: {
          booking: {
            some: {
              OR: result.map((date) => ({
                AND: [
                  { start_date: { lte: date } },
                  { end_date: { gte: date } },
                ],
              })),
            },
          },
        },
      },
    ]
    if(req.query.latitude === null || req.query.latitude === "" || req.query.longitude === null || req.query.longitude === ""){
      typeOfSearch = searchForSpecificLocation
    }
    else{
      typeOfSearch = seachByAllLocation
    }

    const properties = await prisma.property.findMany({
      where: {
        AND: typeOfSearch,
      },
    });

    return res.status(200).json(properties);
  }
}
