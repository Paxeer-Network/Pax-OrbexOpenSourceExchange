// /server/api/admin/ecosystem/orders/index.get.ts

import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { crudParameters, paginationSchema } from "@b/utils/constants";
import { orderSchema } from "./utils";
import { getPaginatedRecords } from "@b/utils/eco/scylla/query";
import { scyllaKeyspace } from "@b/utils/eco/scylla/client";

export const metadata: OperationObject = {
  summary: "List all ecosystem orders",
  operationId: "listEcosystemOrders",
  tags: ["Admin", "Ecosystem Orders"],
  parameters: crudParameters,
  responses: {
    200: {
      description: "Ecosystem orders retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: orderSchema,
                },
              },
              pagination: paginationSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Ecosystem Orders"),
    500: serverErrorResponse,
  },
  permission: "Access Ecosystem Order Management",
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { query } = data;
  return getPaginatedRecords({
    keyspace: scyllaKeyspace,
    table: "orders",
    query,
    sortField: query.sortField || "createdAt",
  });
};
