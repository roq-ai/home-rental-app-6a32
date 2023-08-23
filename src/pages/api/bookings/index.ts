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
        take: limit,
        skip: offset,
        ...(order?.length && {
          orderBy: getOrderByOptions(order),
        }),
      });
    return res.status(200).json(response);
  }

  async function createBooking() {
    await bookingValidationSchema.validate(req.body);
    const startDate = req?.body?.start_date
    const endDate = req?.body?.end_date

    const startDateFormatted = new Date(startDate);
    const endDateFormatted = new Date(endDate);
    const body = { ...req.body };
    body.start_date = startDateFormatted;
    body.end_date = endDateFormatted;
    const property = await prisma.property.findFirst({
      where: { id: body.property_id },
      include: { company: true },
    });
    const company = await prisma.company.findFirst({
      where: { id: body.company_id },
    });
    const usersOfcompany = await roqClient
      .asSuperAdmin()
      .users({ filter: { tenantId: { equalTo: company.tenant_id } } });
    const usersId = usersOfcompany.users.data.map((user) => user.id);
    console.log("property", { property });
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
    console.log("conversatoin", conversationId.createConversation);

    console.log({ property });
    console.log({ company });

    const data = await prisma.booking.create({
      data: {...body, roqConversationId:conversationId.createConversation.id}
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(
    req,
    res
  );
}
