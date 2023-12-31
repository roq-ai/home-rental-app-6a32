import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "server/db";
import {
  errorHandlerMiddleware
} from "server/middlewares";
import {
  convertQueryToPrismaUtil,
  getOrderByOptions,
  parseQueryParams,
} from "server/utils";
import { GetManyQueryOptions } from "interfaces";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getProperties();
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

    const limit = parseInt(_limit as string, 10)  || 20;
    const offset = parseInt(_offset as string, 10)  || 0;
    const response = await prisma.property.findMany({
        ...convertQueryToPrismaUtil(query, 'property'),
        
        take: limit,
        skip: offset,
        ...(order?.length && {
          orderBy: getOrderByOptions(order),
        }),
        include: { booking: true },
      });
    return res.status(200).json(response);
  }

 
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware((handler))(
    req,
    res
  );
}

