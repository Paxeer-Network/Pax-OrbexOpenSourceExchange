// endpoints/getForexPlans.ts
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { baseForexPlanSchema } from "../../utils";
import { models } from "@b/db";

export const metadata: OperationObject = {
  summary: "Retrieves all active Forex plans",
  description: "Fetches all active Forex plans available for investment.",
  operationId: "getForexPlans",
  tags: ["Forex", "Plans"],
  responses: {
    200: {
      description: "Forex plans retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: baseForexPlanSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Forex Plan"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
};

export default async () => {
  try {
    const plans = await models.forexPlan.findAll({
      where: { status: true },
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
