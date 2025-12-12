import { models } from "@b/db";
import { createError } from "@b/utils/error";

import {
  getFiltered,
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { icoContributionSchema } from "@b/api/admin/ext/ico/contribution/utils";
import { crudParameters, paginationSchema } from "@b/utils/constants";

export const metadata: OperationObject = {
  summary: "Retrieves all contributions made by a user",
  description:
    "Fetches a list of all contributions made by the currently logged-in user.",
  operationId: "listUserContributions",
  tags: ["ICO", "Contributions"],
  requiresAuth: true,
  parameters: crudParameters,
  responses: {
    200: {
      description: "List of ICO Contributions with pagination information",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: icoContributionSchema,
                },
              },
              pagination: paginationSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("ICO Contributions"),
    500: serverErrorResponse,
  },
};

export default async (data: Handler) => {
  const { user, query } = data;
  if (!user?.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  // Call the generic fetch function
  return getFiltered({
    model: models.icoContribution,
    query,
    sortField: query.sortField || "createdAt",
    where: { userId: user.id },
    includeModels: [
      {
        model: models.icoPhase,
        as: "phase",
        attributes: ["id", "name"],
        includeModels: [
          {
            model: models.icoToken,
            as: "token",
            attributes: ["name", "currency", "chain", "image"],
          },
        ],
      },
    ],
    numericFields: ["amount"],
  });
};
