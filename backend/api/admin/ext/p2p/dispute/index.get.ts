// /server/api/p2p/disputes/index.get.ts

import { models } from "@b/db";

import { crudParameters, paginationSchema } from "@b/utils/constants";
import {
  getFiltered,
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { p2pDisputeSchema } from "./utils";

export const metadata = {
  summary: "Lists P2P disputes with pagination and optional filtering",
  operationId: "listP2PDisputes",
  tags: ["Admin","P2P", "Disputes"],
  parameters: crudParameters,
  responses: {
    200: {
      description: "List of P2P disputes with pagination information",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: p2pDisputeSchema,
                },
              },
              pagination: paginationSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("P2P Disputes"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
  permission: "Access P2P Dispute Management",
};

export default async (data: Handler) => {
  const { query } = data;

  // Call the generic fetch function
  return getFiltered({
    model: models.p2pDispute,
    query,
    sortField: query.sortField || "createdAt",
    includeModels: [
      {
        model: models.p2pTrade,
        as: "trade",
        attributes: ["id", "status"],
      },
      {
        model: models.user,
        as: "raisedBy",
        attributes: ["firstName", "lastName", "email", "avatar"],
      },
    ],
    // Assuming sensitive fields might be hidden
  });
};
