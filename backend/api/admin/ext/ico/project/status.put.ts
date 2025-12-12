import { updateRecordResponses, updateStatus } from "@b/utils/query";

export const metadata = {
  summary: "Bulk updates the status of ICO projects",
  operationId: "bulkUpdateIcoProjectStatus",
  tags: ["Admin", "ICO Projects"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            ids: {
              type: "array",
              description: "Array of ICO project IDs to update",
              items: { type: "string" },
            },
            status: {
              type: "string",
              enum: ["PENDING", "ACTIVE", "COMPLETED", "REJECTED", "CANCELLED"],
              description: "New status to apply to the ICO projects",
            },
          },
          required: ["ids", "status"],
        },
      },
    },
  },
  responses: updateRecordResponses("ICO Project"),
  requiresAuth: true,
  permission: "Access ICO Project Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { ids, status } = body;
  return updateStatus("icoProject", ids, status);
};
