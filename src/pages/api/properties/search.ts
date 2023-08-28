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
    const guestNumber = req?.query?.num_of_guest as unknown as number;
    generateDateRangeArray(startDate, endDate);
    console.log(startDate, endDate, "startend");
    console.log(latitude,longitude,"latlong1")
    console.log(latitudeOffset,longitudeOffset,"offset")
    let typeOfSearch ;

    const searchSpecificLocation = [
      {
        coords: {
          ST_DWithin: {
            point: {
              x: longitude,
              y: latitude,
            },
            distance: 50000, // Distance in meters (50 km)
          },
        },
      },
      {
        num_of_guest: {
          gte: parseInt(guestNumber),
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

    const searchInAllLocation = [
      
      {
        num_of_guest: {
          gte: parseInt(guestNumber),
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
    if(req.query.latitude == null || req.query.latitude == "" || req.query.longitude ==null || req.query.longitude == ""){
      typeOfSearch = searchInAllLocation
      console.log("all location")
    }
    else{
      typeOfSearch = searchSpecificLocation
      console.log("not all")
    }

    const properties = await prisma.property.findMany({
      where: {
        AND: typeOfSearch,
      },
    });

    console.log({ properties });

    return res.status(200).json(properties);
  }
}
