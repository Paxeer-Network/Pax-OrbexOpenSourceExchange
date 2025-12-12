import { models } from "@b/db";
import { createError } from "@b/utils/error";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { baseStakingPoolSchema } from "../utils";

export const metadata: OperationObject = {
  summary: "Retrieves a specific staking pool",
  description: "Fetches details of a specific staking pool by ID.",
  operationId: "getPoolDetails",
  tags: ["Staking", "Pools"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string", description: "Staking pool ID" },
    },
  ],
  responses: {
    200: {
      description: "Staking pool retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: baseStakingPoolSchema,
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Staking Pool"),
    500: serverErrorResponse,
  },
};

export default async (data: Handler) => {
  const { params } = data;
  const { id } = params;

  const pool = await models.stakingPool.findOne({
    where: { id },
    include: [{ model: models.stakingDuration, as: "stakingDurations" }],
  });
  if (!pool) {
    throw createError({ statusCode: 404, message: "Staking pool not found" });
  }
  return pool;
};
