import { models } from "@b/db";
import { createError } from "@b/utils/error";

import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { baseForexPlanSchema } from "../../../utils";
export const metadata: OperationObject = {
  summary: "Retrieves specific Forex investment status",
  description:
    "Fetches details of a specific Forex investment for the logged-in user.",
  operationId: "getForexInvestmentStatus",
  tags: ["Forex", "Investments"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string", description: "Forex investment ID" },
    },
  ],
  responses: {
    200: {
      description: "Forex plans retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: baseForexPlanSchema,
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Forex Investment"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { user, params } = data;
  if (!user?.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const { id } = params;

  try {
    const plans = await models.forexPlan.findOne({
      where: { id, status: true },
      include: [
        {
          model: models.forexDuration,
          as: "durations",
          attributes: ["id", "duration", "timeframe"],
          through: { attributes: [] },
        },
      ],
      attributes: [
        "id",
        "title",
        "description",
        "image",
        "minAmount",
        "maxAmount",
        "profitPercentage",
        "currency",
        "walletType",
        "trending",
      ],
    });
    return plans;
  } catch (error) {
    console.error("Error fetching forex plans:", error);
    throw error;
  }
};
