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

    let dateArray: any[];
    function generateDateRangeArray(startDate: any, endDate: any) {
      dateArray = [];
      const currentDate = new Date(startDate);

      while (currentDate <= new Date(endDate)) {
        dateArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return dateArray;
    }

    const startDate = req?.query?.start_date;
    const endDate = req?.query?.end_date;
    const guestNumber = req?.query?.num_of_guest as unknown as number;
    generateDateRangeArray(startDate, endDate);
    let properties;

    if (
      req.query.latitude == null ||
      req.query.latitude == "" ||
      req.query.longitude == null ||
      req.query.longitude == ""
    ) {
      properties = await prisma.property.findMany({
        where: {
          AND: [
            {
              num_of_guest: {
                gte: parseInt(guestNumber),
              },
            },
            {
              NOT: {
                booking: {
                  some: {
                    OR: dateArray.map((date) => ({
                      AND: [
                        { start_date: { lte: date } },
                        { end_date: { gte: date } },
                      ],
                    })),
                  },
                },
              },
            },
          ],
        },
      });
    } else {
      //the command for getting all properties

      // const query = `SELECT *FROM property
      // WHERE
      //   latitude BETWEEN $1::NUMERIC - $2::NUMERIC AND $1::NUMERIC + $2::NUMERIC
      //   AND longitude BETWEEN $3::NUMERIC - $4::NUMERIC AND $3::NUMERIC + $4::NUMERIC
      //   AND num_of_guest >= $5::INTEGER
      //   AND NOT EXISTS (
      //     SELECT 1
      //     FROM booking
      //     WHERE property.id = booking.property_id
      //       AND (
      //         ${dateArray
      //           .map(
      //             (_, index) => `
      //           (start_date <= $${index + 6}::DATE AND end_date >= $${
      //               index + 6
      //             }::DATE)
      //         `
      //           )
      //           .join(" OR ")}
      //       )
      //   )
      // `;


        const properties = await prisma.$queryRaw`
        SELECT  ST_AsText(coords::geometry::text)  ,  * 
           
        FROM property
        WHERE ST_DistanceSphere(coords, ST_MakePoint(${longitude},${latitude})) <= 50 * 1000

      `;

      // console.log("specific:", properties);
    }

 
    console.log({ properties });

    return res.status(200).json(properties);
  }
}
