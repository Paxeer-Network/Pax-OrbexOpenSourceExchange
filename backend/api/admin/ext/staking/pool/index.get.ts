import { models } from "@b/db";
import { crudParameters, paginationSchema } from "@b/utils/constants";
import {
  getFiltered,
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { stakingPoolSchema } from "./utils";

export const metadata = {
  summary: "Lists staking pools with pagination and optional filtering",
  operationId: "listStakingPools",
  tags: ["Admin","Staking", "Pools"],
  parameters: crudParameters,
  responses: {
    200: {
      description: "List of staking pools with pagination information",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: stakingPoolSchema,
                },
              },
              pagination: paginationSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Staking Pools"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
  permission: "Access Staking Pool Management",
};

export default async (data: Handler) => {
  const { query } = data;

  // Utilize the generic fetch function with options specific to staking pools
  return getFiltered({
    model: models.stakingPool,
    query,
    sortField: query.sortField || "createdAt",
    includeModels: [
      {
        model: models.stakingDuration,
        as: "stakingDurations",
        attributes: ["id", "duration", "interestRate"],
      },
      {
        model: models.stakingLog,
        as: "stakingLogs",
        attributes: ["id", "amount", "createdAt", "status"],
      },
    ],
  });
};
