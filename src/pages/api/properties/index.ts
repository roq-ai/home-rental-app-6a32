import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "server/db";
import {
  authorizationValidationMiddleware,
  errorHandlerMiddleware,
} from "server/middlewares";
import { propertyValidationSchema } from "validationSchema/properties";
import {
  convertQueryToPrismaUtil,
  getOrderByOptions,
  parseQueryParams,
} from "server/utils";
import { getServerSession } from "@roq/nextjs";
import { GetManyQueryOptions } from "interfaces";
import { UserInterface } from "interfaces/user";
import companies from "pages/companies";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId } = await getServerSession(req);
  switch (req.method) {
    case "GET":
      return getProperties();
    case "POST":
      return createProperty();
    default:
      return res
        .status(405)
        .json({ message: `Method ${req.method} not allowed` });
  }

  async function getProperties() {
    const {
      limit: _limit,
      offset: _offset,
      order,
      ...query
    } = parseQueryParams(req.query) as Partial<GetManyQueryOptions>;
    const user = await prisma.user.findMany({
      where: { roq_user_id: roqUserId },
      include: { company: true },
    });
    const company = await prisma.company.findFirst({
      where: { user_id: user[0].id },
    });

    const limit = parseInt(_limit as string, 10) || 20;
    const offset = parseInt(_offset as string, 10) || 0;
    const response = await prisma.property.findMany({
      ...convertQueryToPrismaUtil(query, "property"),
      where: {
        company_id: company.id,
      },
      take: limit,
      skip: offset,
      ...(order?.length && {
        orderBy: getOrderByOptions(order),
      }),
      include: { booking: true },
    });
    return res.status(200).json(response);
  }

  async function createProperty() {
    const { coords, ...dataWithoutCoords } = req.body;
    const coordsValue = coords;
    console.log(dataWithoutCoords, "body");
    console.log(coordsValue, "coordsValue");
    if (dataWithoutCoords?.booking?.length > 0) {
      const create_booking = dataWithoutCoords.booking;
      dataWithoutCoords.booking = {
        create: create_booking,
      };
    } else {
      delete dataWithoutCoords.booking;
    }
    const user = await prisma.user.findMany({
      where: { roq_user_id: roqUserId },
      include: { company: true },
    });
    const company = await prisma.company.findFirst({
      where: { user_id: user[0].id },
    });
    const data = await prisma.property.create({
      data: { ...dataWithoutCoords, company_id: company.id },
    });
    // the id logic here
    // const theId = "894c7427-5068-4bd2-9748-f5cdc722f5b2";
    const theId = data.id;
    console.log(data, "data");
    console.log(data.id, "data id");
    let updateCoords ;
    if (data) {
      // query string for updating the coords field goes here
      const createdCoords = await prisma.$executeRaw`UPDATE property SET coords = ${coordsValue} WHERE id = ${theId}::uuid;`;
      console.log(createdCoords, "checker here please work");
      updateCoords = createdCoords
    }
    if(updateCoords){
      return res.status(200).json(data);
    }
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
