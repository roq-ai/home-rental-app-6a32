import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let result :any[];
  function generateDateRangeArray(startDate: any, endDate: any) {
     result = [];
    const currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      result.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    console.log(result, "test 3");

    return result;
  }
  const fiftyKmLatitudeOffset = 0.4491555875; //
  const fiftyKmLongitudeOffset = 0.5986; //
  console.log(req.query, "hello server");
  const startDate = req?.query?.start_date;
  const endDate = req?.query?.end_date;
  const guestNumber = parseInt(req?.query?.num_of_guest);
  console.log(guestNumber,"please 1")
  generateDateRangeArray(startDate, endDate);
  console.log(result,"after test")
  if (req.method == "GET") {
    const data = await prisma.property.findMany({
      where: {
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
        num_of_guest: {
          gte: guestNumber, // Replace with your desired maximum number of guests
        },
      },
    });
    
    console.log(data,"data4");
    return res.status(200).json(data);
  }
}
