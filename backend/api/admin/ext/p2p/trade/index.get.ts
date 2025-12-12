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

export const metadata = {
  summary: "Lists P2P trades with pagination and optional filtering",
  operationId: "listP2PTrades",
  tags: ["Admin","P2P", "Trades"],
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
  permission: "Access P2P Trade Management",
};

export default async (data: Handler) => {
  const { query } = data;

  // Call the generic fetch function
  return getFiltered({
    model: models.p2pTrade,
    query,
    sortField: query.sortField || "createdAt",
    includeModels: [
      {
        model: models.user,
        as: "user",
        attributes: ["id", "firstName", "lastName", "email", "avatar"],
      },
      {
        model: models.user,
        as: "seller",
        attributes: ["id", "firstName", "lastName", "email", "avatar"],
      },
      {
        model: models.p2pOffer,
        as: "offer",
        attributes: ["id", "status", "currency"],
        includeModels: [
          {
            model: models.p2pPaymentMethod,
            as: "paymentMethod",
          },
          {
            model: models.p2pReview,
            as: "p2pReviews",
            attributes: ["id", "rating", "comment", "createdAt"],
            includeModels: [
              {
                model: models.user,
                as: "reviewer",
                attributes: ["id", "firstName", "lastName", "email", "avatar"],
              },
            ],
          },
        ],
      },
      {
        model: models.p2pDispute,
        as: "p2pDisputes",
        attributes: ["id", "status", "resolution", "reason"],
        includeModels: [
          {
            model: models.user,
            as: "raisedBy",
            attributes: ["id", "firstName", "lastName", "email", "avatar"],
          },
        ],
      },
    ],
    numericFields: ["amount"],
  });
};
