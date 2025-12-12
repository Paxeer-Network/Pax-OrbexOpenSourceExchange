import { updateRecordResponses, updateStatus } from "@b/utils/query";

export const metadata = {
  summary: "Bulk updates the status of ICO tokens",
  operationId: "bulkUpdateIcoTokenStatus",
  tags: ["Admin", "ICO Tokens"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            ids: {
              type: "array",
              description: "Array of ICO token IDs to update",
              items: { type: "string" },
            },
            status: {
              type: "string",
              enum: ["PENDING", "ACTIVE", "COMPLETED", "REJECTED", "CANCELLED"],
              description: "New status to apply to the ICO tokens",
            },
          },
          required: ["ids", "status"],
        },
      },
    },
  },
  responses: updateRecordResponses("ICO Token"),
  requiresAuth: true,
  permission: "Access ICO Token Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { ids, status } = body;
  return updateStatus("icoToken", ids, status);
};
