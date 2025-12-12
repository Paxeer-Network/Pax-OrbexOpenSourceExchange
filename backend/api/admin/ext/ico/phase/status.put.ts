import { updateRecordResponses, updateStatus } from "@b/utils/query";

export const metadata = {
  summary: "Bulk updates the status of ICO phases",
  operationId: "bulkUpdateIcoPhaseStatus",
  tags: ["Admin", "ICO Phases"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            ids: {
              type: "array",
              description: "Array of ICO phase IDs to update",
              items: { type: "string" },
            },
            status: {
              type: "string",
              enum: ["PENDING", "ACTIVE", "COMPLETED", "REJECTED", "CANCELLED"],
              description: "New status to apply to the ICO phases",
            },
          },
          required: ["ids", "status"],
        },
      },
    },
  },
  responses: updateRecordResponses("ICO Phase"),
  requiresAuth: true,
  permission: "Access ICO Phase Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { ids, status } = body;
  return updateStatus("icoPhase", ids, status);
};
