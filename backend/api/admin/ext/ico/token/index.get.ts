// /server/api/ico/tokens/index.get.ts

import { models } from "@b/db";

import { crudParameters, paginationSchema } from "@b/utils/constants";
import {
  getFiltered,
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { icoTokenSchema } from "./utils";

export const metadata = {
  summary: "Lists all ICO Tokens with pagination and optional filtering",
  operationId: "listIcoTokens",
  tags: ["Admin","ICO", "Tokens"],
  parameters: crudParameters,
  responses: {
    200: {
      description: "List of ICO Tokens with pagination information",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: icoTokenSchema,
                },
              },
              pagination: paginationSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("ICO Tokens"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
  permission: "Access ICO Token Management",
};

export default async (data: Handler) => {
  const { query } = data;

  // Call the generic fetch function
  return getFiltered({
    model: models.icoToken,
    query,
    sortField: query.sortField || "createdAt",
    customStatus: [
      {
        key: "status",
        true: "ACTIVE",
        false: "PENDING",
      },
    ],
    includeModels: [
      {
        model: models.icoProject,
        as: "project",
        attributes: ["id", "name"],
      },
    ],
    // Assuming you might want to hide these
  });
};
