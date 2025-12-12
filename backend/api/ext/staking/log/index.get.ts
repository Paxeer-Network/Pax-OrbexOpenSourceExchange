// /server/api/staking/logs/index.get.ts

import { stakingLogSchema } from "@b/api/admin/ext/staking/log/utils";
import { models } from "@b/db";

import { crudParameters, paginationSchema } from "@b/utils/constants";
import { createError } from "@b/utils/error";
import {
  getFiltered,
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Lists all staking logs with pagination and optional filtering",
  operationId: "listStakingLogs",
  tags: ["Staking", "Logs"],
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
};

export default async (data: Handler) => {
  const { user, query } = data;
  if (!user?.id)
    throw createError({ statusCode: 401, message: "Unauthorized" });

  // Call the generic fetch function
  return getFiltered({
    model: models.stakingLog,
    query,
    where: { userId: user.id },
    sortField: query.sortField || "createdAt",
    includeModels: [
      {
        model: models.stakingPool,
        as: "pool",
      },
      {
        model: models.stakingDuration,
        as: "duration",
        attributes: ["id", "duration", "interestRate"],
      },
    ],
  });
};
