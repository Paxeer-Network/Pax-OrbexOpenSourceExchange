// /server/api/staking/durations/index.get.ts

import { models } from "@b/db";

import { crudParameters, paginationSchema } from "@b/utils/constants";
import {
  getFiltered,
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { stakingDurationSchema } from "./utils";

export const metadata = {
  summary: "Lists all staking durations with pagination and optional filtering",
  operationId: "listStakingDurations",
  tags: ["Admin", "Staking", "Durations"],
  parameters: crudParameters,
  responses: {
    200: {
      description: "List of staking durations with pagination information",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: stakingDurationSchema,
                },
              },
              pagination: paginationSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Staking Durations"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
  permission: "Access Staking Duration Management",
};

export default async (data: Handler) => {
  const { query } = data;

  // Call the generic fetch function
  return getFiltered({
    model: models.stakingDuration,
    query,
    sortField: query.sortField || "createdAt",
    includeModels: [
      {
        model: models.stakingPool,
        as: "pool",
        attributes: ["id", "name", "status", "icon"],
      },
    ],
  });
};
