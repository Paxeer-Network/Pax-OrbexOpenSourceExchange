// /server/api/p2p/commissions/index.get.ts

import { models } from "@b/db";

import { crudParameters, paginationSchema } from "@b/utils/constants";
import {
  getFiltered,
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { p2pCommissionSchema } from "./utils";

export const metadata = {
  summary: "Lists P2P Commissions with pagination and optional filtering",
  operationId: "listP2PCommissions",
  tags: ["Admin","P2P", "Commissions"],
  parameters: crudParameters,
  responses: {
    200: {
      description: "List of P2P Commissions with pagination information",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: p2pCommissionSchema,
                },
              },
              pagination: paginationSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("P2P Commissions"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
  permission: "Access P2P Commission Management",
};

export default async (data: Handler) => {
  const { query } = data;

  // Call the generic fetch function
  return getFiltered({
    model: models.p2pCommission,
    query,
    sortField: query.sortField || "createdAt",
    includeModels: [
      {
        model: models.p2pTrade,
        as: "trade",
        attributes: ["id", "status"],
      },
    ],
    // Assuming sensitive fields might be hidden
  });
};
