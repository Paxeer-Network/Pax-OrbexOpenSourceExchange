// /server/api/faq/index.get.ts

import { models } from "@b/db";

import { crudParameters, paginationSchema } from "@b/utils/constants";
import {
  getFiltered,
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { faqSchema } from "./utils";

export const metadata: OperationObject = {
  summary: "Lists all FAQs with pagination and optional filtering",
  operationId: "listFAQs",
  tags: ["Admin", "FAQ"],
  parameters: crudParameters,
  responses: {
    200: {
      description: "List of FAQs with category details",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: faqSchema,
                },
              },
              pagination: paginationSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("FAQs"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
  permission: "Access FAQ Management",
};

export default async (data: Handler) => {
  const { query } = data;

  return getFiltered({
    model: models.faq,
    query,
    sortField: query.sortField || "createdAt",
    includeModels: [
      {
        model: models.faqCategory,
        as: "faqCategory",
      },
    ],
  });
};
