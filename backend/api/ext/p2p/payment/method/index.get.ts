// /server/api/admin/p2p/payment_methods/index.get.ts

import { models } from "@b/db";
import {
  getFiltered,
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { crudParameters, paginationSchema } from "@b/utils/constants";
import { baseP2pPaymentMethodSchema } from "./utils";
import { createError } from "@b/utils/error";

export const metadata: OperationObject = {
  summary: "List all P2P payment methods",
  operationId: "listP2PPaymentMethods",
  tags: ["P2P", "Payment Methods"],
  parameters: crudParameters,
  responses: {
    200: {
      description: "List of P2P offers with pagination information",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: baseP2pPaymentMethodSchema,
                },
              },
              pagination: paginationSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("P2P Payment Methods"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { user, query } = data;
  if (!user?.id) throw createError(401, "Unauthorized");

  return getFiltered({
    model: models.p2pPaymentMethod,
    query,
    where: { userId: user.id },
    sortField: query.sortField || "createdAt",
  });
};
