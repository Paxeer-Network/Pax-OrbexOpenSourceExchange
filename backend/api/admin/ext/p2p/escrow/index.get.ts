// /server/api/p2p/escrows/index.get.ts

import { models } from "@b/db";

import { crudParameters, paginationSchema } from "@b/utils/constants";
import {
  getFiltered,
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { p2pEscrowSchema } from "./utils";

export const metadata = {
  summary: "Lists P2P escrows with pagination and optional filtering",
  operationId: "listP2PEscrows",
  tags: ["Admin","P2P", "Escrows"],
  parameters: crudParameters,
  responses: {
    200: {
      description: "List of P2P escrow records with pagination information",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: p2pEscrowSchema,
                },
              },
              pagination: paginationSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("P2P Escrows"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
  permission: "Access P2P Escrow Management",
};

export default async (data: Handler) => {
  const { query } = data;

  // Call the generic fetch function
  return getFiltered({
    model: models.p2pEscrow,
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
