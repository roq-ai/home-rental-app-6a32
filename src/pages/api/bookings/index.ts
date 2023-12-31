import type { NextApiRequest, NextApiResponse } from "next";
import { roqClient } from "server/roq";
import { prisma } from "server/db";
import {
  authorizationValidationMiddleware,
  errorHandlerMiddleware,
} from "server/middlewares";
import { bookingValidationSchema } from "validationSchema/bookings";
import {
  convertQueryToPrismaUtil,
  getOrderByOptions,
  parseQueryParams,
} from "server/utils";
import { getServerSession } from "@roq/nextjs";
import { GetManyQueryOptions } from "interfaces";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case "GET":
      return getBookings();
    case "POST":
      return createBooking();
    default:
      return res
        .status(405)
        .json({ message: `Method ${req.method} not allowed` });
  }

  async function getBookings() {
    const {
      limit: _limit,
      offset: _offset,
      order,
      ...query
    } = parseQueryParams(req.query) as Partial<GetManyQueryOptions>;
    const limit = parseInt(_limit as string, 10) || 20;
    const offset = parseInt(_offset as string, 10) || 0;
    const response = await prisma.booking
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findManyPaginated({
        ...convertQueryToPrismaUtil(query, "booking"),
        ...(order?.length && {
          orderBy: getOrderByOptions(order),
        }),
      });
    return res.status(200).json(response);
  }

  async function createBooking() {
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


    await bookingValidationSchema.validate(req.body);
    const startDate = req?.body?.start_date;
    const endDate = req?.body?.end_date;
    generateDateRangeArray(startDate, endDate);

    const startDateFormatted = new Date(startDate);
    const endDateFormatted = new Date(endDate);
    const body = { ...req.body };
    body.start_date = startDateFormatted;
    body.end_date = endDateFormatted;

    const numberOfBookingNotAvailable = await prisma.booking.count({
      where: {
        property_id: body?.property_id,

          OR: result.map((date) => ({
            start_date: { lte: date },
            end_date: { gte: date },
          })),
      },
    });
    const property = await prisma.property.findFirst({
      where: { id: body.property_id },
      include: { company: true },
    });
    const usersOfcompany = await roqClient
      .asSuperAdmin()
      .users({ filter: { tenantId: { equalTo: property.company.tenant_id } } });

    const usersId = usersOfcompany.users.data.map((user) => user.id);
    const conversationId = await roqClient
      .asUser(roqUserId)
      .createConversation({
        conversation: {
          title: property.name,
          ownerId: roqUserId,
          memberIds: [roqUserId, ...usersId],
          isGroup: true,
          tags: ["test"],
        },
      });
    if (numberOfBookingNotAvailable == 0) {
      const data = await prisma.booking.create({
        data: {
          ...body,
          roqConversationId: conversationId.createConversation.id,
        },
      });
      return res.status(200).json(data);
    } else {
      return res.status(203).send({ success: false, error: "reserved",identifier:'alreadyBooked' });
    }
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(
    req,
    res
  );
}

