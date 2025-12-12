// /server/api/ico/phases/index.get.ts

import { models } from "@b/db";

import { crudParameters, paginationSchema } from "@b/utils/constants";
import {
  getFiltered,
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { icoPhaseSchema } from "./utils";

export const metadata = {
  summary: "Lists all ICO Phases with pagination and optional filtering",
  operationId: "listIcoPhases",
  tags: ["Admin","ICO", "Phases"],
  parameters: crudParameters,
  responses: {
    200: {
      description: "List of ICO Phases with pagination information",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: icoPhaseSchema,
                },
              },
              pagination: paginationSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("ICO Phases"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
  permission: "Access ICO Phase Management",
};

export default async (data: Handler) => {
  const { query } = data;

  // Call the generic fetch function
  return getFiltered({
    model: models.icoPhase,
    query,
    sortField: query.sortField || "createdAt",
    customStatus: [
      {
        key: "status",
        true: "ACTIVE",
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
    numericFields: ["price", "minPurchase", "maxPurchase"],
  });
};
