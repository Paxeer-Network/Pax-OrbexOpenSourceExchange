import { models } from "@b/db";

import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { baseFAQCategorySchema } from "./utils";

export const metadata: OperationObject = {
  summary: "List all FAQ categories",
  description:
    "Retrieves a list of all FAQ categories along with their associated FAQs.",
  operationId: "listCategories",
  tags: ["FAQ"],
  responses: {
    200: {
      description: "FAQ categories retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: baseFAQCategorySchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Faq Category"),
    500: serverErrorResponse,
  },
};

export default async () => {
  const categories = await models.faqCategory.findAll({
    include: [
      {
        model: models.faq,
        as: "faqs",
      },
    ],
  });
  return categories;
};
