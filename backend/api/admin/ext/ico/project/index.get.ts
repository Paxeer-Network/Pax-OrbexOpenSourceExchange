// /server/api/ico/projects/index.get.ts

import { models } from "@b/db";

import { crudParameters, paginationSchema } from "@b/utils/constants";
import {
  getFiltered,
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { icoProjectSchema } from "./utils";

export const metadata = {
  summary: "Lists all ICO Projects with pagination and optional filtering",
  operationId: "listIcoProjects",
  tags: ["Admin","ICO", "Projects"],
  parameters: crudParameters,
  responses: {
    200: {
      description: "List of ICO Projects with pagination information",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: icoProjectSchema,
                },
              },
              pagination: paginationSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("ICO Projects"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
  permission: "Access ICO Project Management",
};

export default async (data: Handler) => {
  const { query } = data;

  // Call the generic fetch function
  return getFiltered({
    model: models.icoProject,
    query,
    sortField: query.sortField || "createdAt",
  });
};
