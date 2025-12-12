// /server/api/staking/logs/index.get.ts

import { models } from "@b/db";

import { crudParameters, paginationSchema } from "@b/utils/constants";
import {
  getFiltered,
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { stakingLogSchema } from "./utils";

export const metadata = {
  summary: "Lists all staking logs with pagination and optional filtering",
  operationId: "listStakingLogs",
  tags: ["Admin","Staking", "Logs"],
  parameters: crudParameters,
  responses: {
    200: {
      description: "List of staking logs with pagination information",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: stakingLogSchema,
                },
              },
              pagination: paginationSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Staking Logs"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
  permission: "Access Staking Management",
};

export default async (data: Handler) => {
  const { query } = data;

  // Call the generic fetch function
  return getFiltered({
    model: models.stakingLog,
    query,
    sortField: query.sortField || "createdAt",
    includeModels: [
      {
        model: models.user,
        as: "user",
        attributes: ["firstName", "lastName", "email", "avatar"],
      },
      {
        model: models.stakingPool,
        as: "pool",
        attributes: ["id", "name", "status", "icon"],
      },
      {
        model: models.stakingDuration,
        as: "duration",
        attributes: ["id", "duration", "interestRate"],
      },
    ],
  });
};
