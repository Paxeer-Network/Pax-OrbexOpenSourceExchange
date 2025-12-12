import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { baseOrderSchema } from "./utils";
import { createError } from "@b/utils/error";
import { getOrders } from "@b/utils/futures/queries/order";

export const metadata: OperationObject = {
  summary: "List Futures Orders",
  operationId: "listFuturesOrders",
  tags: ["Futures", "Orders"],
  description: "Retrieves a list of futures orders for the authenticated user.",
  parameters: [
    {
      name: "currency",
      in: "query",
      description: "Currency of the orders to retrieve.",
      schema: { type: "string" },
    },
    {
      name: "pair",
      in: "query",
      description: "Pair of the orders to retrieve.",
      schema: { type: "string" },
    },
    {
      name: "type",
      in: "query",
      description: "Type of order to retrieve.",
      schema: { type: "string" },
    },
  ],
  responses: {
    200: {
      description: "A list of futures orders",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: baseOrderSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Order"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { user } = data;
  if (!user?.id) throw new Error("Unauthorized");
  const { currency, pair, type } = data.query;

  if (!user?.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  return await getOrders(user.id, `${currency}/${pair}`, type === "OPEN");
};
