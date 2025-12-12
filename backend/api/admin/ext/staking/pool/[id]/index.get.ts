import { models } from "@b/db";
import {
  getRecord,
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { baseStakingPoolSchema } from "../utils";

export const metadata = {
  summary: "Retrieves detailed information of a specific Staking Pool by ID",
  operationId: "getStakingPoolById",
  tags: ["Admin", "Staking Pools"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the Staking Pool to retrieve",
      schema: { type: "string" },
    },
  ],
  responses: {
    200: {
      description: "Staking Pool details",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: baseStakingPoolSchema, // Define this schema in your utils if it's not already defined
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Staking Pool"),
    500: serverErrorResponse,
  },
  permission: "Access Staking Pool Management",
  requiresAuth: true,
};

export default async (data) => {
  const { params } = data;

  return await getRecord("stakingPool", params.id, [
    {
      model: models.stakingDuration,
      as: "stakingDurations",
    },
    {
      model: models.stakingLog,
      as: "stakingLogs",
    },
  ]);
};
