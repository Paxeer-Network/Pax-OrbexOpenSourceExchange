// /server/api/faq/categories/index.get.ts

import { models } from "@b/db";

import { crudParameters, paginationSchema } from "@b/utils/constants";
import {
  getFiltered,
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { faqCategorySchema } from "./utils";

export const metadata: OperationObject = {
  summary: "Lists all FAQ categories with optional detailed FAQs",
  operationId: "listFAQCategories",
  tags: ["Admin", "FAQ"],
  parameters: crudParameters,
  responses: {
    200: {
      description: "List of FAQ categories with optional FAQs included",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: faqCategorySchema,
                },
              },
              pagination: paginationSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("FAQ Categories"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
  permission: "Access FAQ Category Management",
};

export default async (data: Handler) => {
  const { query } = data;

  return getFiltered({
    model: models.faqCategory,
    query,
    sortField: query.sortField || "id",
    timestamps: false,
    includeModels: [
      {
        model: models.faq,
        as: "faqs",
        attributes: ["id", "question", "answer"],
      },
    ],
  });
};
