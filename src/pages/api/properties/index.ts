import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { propertyValidationSchema } from 'validationSchema/properties';
import { convertQueryToPrismaUtil, getOrderByOptions, parseQueryParams } from 'server/utils';
import { getServerSession } from '@roq/nextjs';
import { GetManyQueryOptions } from 'interfaces';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getProperties();
    case 'POST':
      return createProperty();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
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
      });
    return res.status(200).json(response);
  }

  async function createProperty() {
    await propertyValidationSchema.validate(req.body);
    const body = { ...req.body };
    
    // console.log({body})
    if (body?.booking?.length > 0) {
      const create_booking = body.booking;
      body.booking = {
        create: create_booking,
      };
    } else {
      delete body.booking;
    }
    const data = await prisma.property.create({
      data: body,
    });
    
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}