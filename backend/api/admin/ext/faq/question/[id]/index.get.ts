import {
  getRecord,
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { baseFaqSchema } from "../utils";
import { models } from "@b/db";

export const metadata: OperationObject = {
  summary: "Retrieves detailed information of a specific FAQ entry by ID",
  operationId: "getFaqById",
  tags: ["Admin", "FAQs"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the FAQ to retrieve",
      schema: { type: "string" },
    },
  ],
  responses: {
    200: {
      description: "FAQ entry details",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: baseFaqSchema, // Define this schema in your utils if it's not already defined
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("FAQ"),
    500: serverErrorResponse,
  },
  permission: "Access FAQ Management",
  requiresAuth: true,
};

export default async (data) => {
  const { params } = data;

  return await getRecord("faq", params.id, [
    {
      model: models.faqCategory,
      as: "faqCategory",
    },
  ]);
};
