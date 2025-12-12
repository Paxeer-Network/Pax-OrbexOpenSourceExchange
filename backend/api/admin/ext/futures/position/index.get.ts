// backend/api/admin/ext/futures/position/index.get.ts

import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { crudParameters, paginationSchema } from "@b/utils/constants";
import { getPaginatedRecords } from "@b/utils/eco/scylla/query";
import { scyllaFuturesKeyspace } from "@b/utils/eco/scylla/client";
import { positionSchema } from "./utils";

export const metadata: OperationObject = {
  summary: "List all futures positions",
  operationId: "listFuturesPositions",
  tags: ["Admin", "Futures Positions"],
  parameters: crudParameters,
  responses: {
    200: {
      description: "Futures positions retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: positionSchema,
                },
              },
              pagination: paginationSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Futures Positions"),
    500: serverErrorResponse,
  },
  permission: "Access Futures Position Management",
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { query } = data;
  return getPaginatedRecords({
    keyspace: scyllaFuturesKeyspace,
    table: "position",
    query,
    sortField: query.sortField || "createdAt",
  });
};
