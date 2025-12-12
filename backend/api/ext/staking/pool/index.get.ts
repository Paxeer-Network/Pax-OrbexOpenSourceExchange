import { models } from "@b/db";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { baseStakingPoolSchema } from "./utils";

export const metadata: OperationObject = {
  summary: "Retrieves all active staking pools",
  description:
    "Fetches a list of all active staking pools available for staking.",
  operationId: "listActivePools",
  tags: ["Staking", "Pools"],
  requiresAuth: true,
  responses: {
    200: {
      description: "Staking pools retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: baseStakingPoolSchema,
            },
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
  const { user } = data;
  let where = {};
  if (user?.id) {
    where = { userId: user.id };
  }
  return await models.stakingPool.findAll({
    where: { status: "ACTIVE" },
    include: [
      { model: models.stakingDuration, as: "stakingDurations" },
      {
        model: models.stakingLog,
        as: "stakingLogs",
        where: { status: "ACTIVE", ...where },
        required: false,
        include: [{ model: models.stakingDuration, as: "duration" }],
      },
    ],
  });
};
