import { updateRecord, updateRecordResponses } from "@b/utils/query";
import { faqUpdateSchema } from "../utils";

export const metadata: OperationObject = {
  summary: "Updates a specific FAQ",
  operationId: "updateFaq",
  tags: ["Admin", "FAQs"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      description: "ID of the FAQ to update",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    description: "New data for the FAQ",
    content: {
      "application/json": {
        schema: faqUpdateSchema,
      },
    },
  },
  responses: updateRecordResponses("FAQ"),
  requiresAuth: true,
  permission: "Access FAQ Management",
};

export default async (data) => {
  const { body, params } = data;
  const { id } = params;
  const { categoryId, question, answer, videoUrl } = body;

  return await updateRecord("faq", id, {
    categoryId,
    question,
    answer,
    videoUrl,
  });
};
