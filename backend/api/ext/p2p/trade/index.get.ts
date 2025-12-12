// /server/api/p2p/trades/index.get.ts

import { models } from "@b/db";

import { crudParameters, paginationSchema } from "@b/utils/constants";
import {
  getFiltered,
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { p2pTradeSchema } from "./utils";
import { Op } from "sequelize";

export const metadata: OperationObject = {
  summary: "Lists P2P trades with pagination and optional filtering",
  operationId: "listP2PTrades",
  tags: ["P2P", "Trades"],
  parameters: crudParameters,
  responses: {
    200: {
      description: "List of P2P trades with pagination information",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: p2pTradeSchema,
                },
              },
              pagination: paginationSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("P2P Trades"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { user, query } = data;
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Call the generic fetch function
  return getFiltered({
    model: models.p2pTrade,
    query,
    where: {
      [Op.or]: [{ userId: user.id }, { sellerId: user.id }],
    },
    sortField: query.sortField || "createdAt",
    includeModels: [
      {
        model: models.user,
        as: "user",
        attributes: ["firstName", "lastName", "email", "avatar"],
      },
      {
        model: models.user,
        as: "seller",
        attributes: ["firstName", "lastName", "email", "avatar"],
      },
      {
        model: models.p2pOffer,
        as: "offer",
        attributes: ["id", "status", "currency", "chain", "walletType"],
      },
      {
        model: models.p2pDispute,
        as: "p2pDisputes",
        attributes: ["id", "status"],
      },
    ],
    numericFields: ["amount"],
  });
};
