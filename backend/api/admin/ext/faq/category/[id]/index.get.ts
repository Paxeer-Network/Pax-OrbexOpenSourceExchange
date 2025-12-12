import {
  getRecord,
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { baseFaqCategorySchema } from "../utils";
import { models } from "@b/db";

export const metadata: OperationObject = {
  summary: "Retrieves detailed information of a specific FAQ category by ID",
  operationId: "getFaqCategoryById",
  tags: ["Admin", "FAQ Categories"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the FAQ category to retrieve",
      schema: { type: "string" },
    },
  ],
  responses: {
    200: {
      description: "FAQ category details",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: baseFaqCategorySchema, // Define this schema in your utils if it's not already defined
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("FAQ Category"),
    500: serverErrorResponse,
  },
  permission: "Access FAQ Category Management",
  requiresAuth: true,
};

export default async (data) => {
  const { params } = data;

  return await getRecord("faqCategory", params.id, [
    {
      model: models.faq,
      as: "faqs",
      attributes: ["id", "question", "answer"],
    },
  ]);
};
