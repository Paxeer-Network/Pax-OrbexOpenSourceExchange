import { models } from "@b/db";
import { createError } from "@b/utils/error";

import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { baseForexInvestmentSchema } from "./utils";

export const metadata: OperationObject = {
  summary: "Retrieves all Forex investments for the logged-in user",
  description:
    "Fetches all Forex investments linked to the currently authenticated user.",
  operationId: "getAllForexInvestments",
  tags: ["Forex", "Investments"],
  responses: {
    200: {
      description: "Forex investments retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: baseForexInvestmentSchema,
            },
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
  const { user } = data;
  if (!user?.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const investments = await models.forexInvestment.findAll({
    where: { userId: user.id },
    include: [
      {
        model: models.forexPlan,
        as: "plan",
        attributes: [
          "id",
          "name",
          "title",
          "description",
          "profitPercentage",
          "image",
        ],
      },
      {
        model: models.user,
        as: "user",
        attributes: ["id", "avatar", "firstName", "lastName"],
      },
      {
        model: models.forexDuration,
        as: "duration",
        attributes: ["id", "duration", "timeframe"],
      },
    ],
  });
  return investments;
};
