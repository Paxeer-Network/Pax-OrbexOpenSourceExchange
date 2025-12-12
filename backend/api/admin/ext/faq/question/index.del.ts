// /server/api/faq/delete.del.ts

import {
  commonBulkDeleteParams,
  commonBulkDeleteResponses,
  handleBulkDelete,
} from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Bulk deletes FAQs by IDs",
  operationId: "bulkDeleteFAQs",
  tags: ["Admin","FAQ"],
  parameters: commonBulkDeleteParams("FAQs"),
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            ids: {
              type: "array",
              items: { type: "string" },
              description: "Array of FAQ IDs to delete",
            },
          },
          required: ["ids"],
        },
      },
    },
  },
  responses: commonBulkDeleteResponses("FAQs"),
  requiresAuth: true,
  permission: "Access FAQ Management",
};

export default async (data: Handler) => {
  const { body, query } = data;
  const { ids } = body;
  return handleBulkDelete({
    model: "faq",
    ids,
    query,
  });
};
