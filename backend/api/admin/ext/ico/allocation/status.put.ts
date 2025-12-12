import { updateRecordResponses, updateStatus } from "@b/utils/query";

export const metadata = {
  summary: "Bulk updates the status of ICO allocations",
  operationId: "bulkUpdateIcoAllocationStatus",
  tags: ["Admin", "ICO Allocations"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            ids: {
              type: "array",
              description: "Array of ICO allocation IDs to update",
              items: { type: "string" },
            },
            status: {
              type: "string",
              enum: ["PENDING", "COMPLETED", "CANCELLED", "REJECTED"],
              description: "New status to apply to the ICO allocations",
            },
          },
          required: ["ids", "status"],
        },
      },
    },
  },
  responses: updateRecordResponses("ICO Allocation"),
  requiresAuth: true,
  permission: "Access ICO Allocation Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { ids, status } = body;
  return updateStatus("icoAllocation", ids, status);
};
