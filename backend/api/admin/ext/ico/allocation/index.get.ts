// /server/api/ico/allocations/index.get.ts

import { models } from "@b/db";

import { crudParameters, paginationSchema } from "@b/utils/constants";
import {
  getFiltered,
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { icoAllocationSchema } from "./utils";

export const metadata = {
  summary: "Lists all ICO Allocations with pagination and optional filtering",
  operationId: "listIcoAllocations",
  tags: ["Admin","ICO", "Allocations"],
  parameters: crudParameters,
  responses: {
    200: {
      description: "List of ICO Allocations with pagination information",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: icoAllocationSchema,
                },
              },
              pagination: paginationSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("ICO Allocations"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
  permission: "Access ICO Allocation Management",
};

export default async (data: Handler) => {
  const { query } = data;

  // Call the generic fetch function
  return getFiltered({
    model: models.icoAllocation,
    query,
    sortField: query.sortField || "createdAt",
    customStatus: [
      {
        key: "status",
        true: "COMPLETED",
        false: "PENDING",
      },
    ],
    includeModels: [
      {
        model: models.icoToken,
        as: "token",
        attributes: ["name", "currency", "chain", "image"],
      },
    ],
    numericFields: ["percentage"],
  });
};
