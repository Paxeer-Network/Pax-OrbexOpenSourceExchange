// /server/api/ico/contributions/index.get.ts

import { models } from "@b/db";

import { crudParameters, paginationSchema } from "@b/utils/constants";
import {
  getFiltered,
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { icoContributionSchema } from "./utils";

export const metadata = {
  summary: "Lists all ICO Contributions with pagination and optional filtering",
  operationId: "listIcoContributions",
  tags: ["Admin","ICO", "Contributions"],
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
  requiresAuth: true,
  permission: "Access ICO Contribution Management",
};

export default async (data: Handler) => {
  const { query } = data;

  // Call the generic fetch function
  return getFiltered({
    model: models.icoContribution,
    query,
    sortField: query.sortField || "createdAt",
    customStatus: [
      {
        key: "status",
        true: "COMPLETED",
        false: "PENDING",
      },
    ],
    includeModels: [
      {
        model: models.user,
        as: "user",
        attributes: ["firstName", "lastName", "email", "avatar"],
      },
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
