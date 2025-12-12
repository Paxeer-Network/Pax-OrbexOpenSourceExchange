import { models } from "@b/db";
import { createError } from "@b/utils/error";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { baseStakeSchema } from "../utils";

export const metadata: OperationObject = {
  summary: "Retrieves a specific stake for the logged-in user",
  description:
    "Fetches details of a specific stake by ID for the logged-in user.",
  operationId: "getStakeById",
  tags: ["Staking", "User Stakes"],
  requiresAuth: true,
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string", description: "Stake ID" },
    },
  ],
  responses: {
    200: {
      description: "Stake retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: baseStakeSchema,
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Stake"),
    500: serverErrorResponse,
  },
};

export default async (data: Handler) => {
  const { params, user } = data;
  const { id } = params;
  if (!user?.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const stake = await models.stakingLog.findOne({
    where: { id, userId: user.id },
    include: [{ model: models.stakingPool, as: "pool" }],
  });
  if (!stake) {
    throw createError({ statusCode: 404, message: "Stake not found" });
  }
  return stake;
};
