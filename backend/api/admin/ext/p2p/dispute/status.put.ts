import { updateRecordResponses, updateStatus } from "@b/utils/query";

export const metadata = {
  summary: "Bulk updates the status of P2P Disputes",
  operationId: "bulkUpdateP2pDisputeStatus",
  tags: ["Admin", "P2P Disputes"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            ids: {
              type: "array",
              description: "Array of P2P Dispute IDs to update",
              items: { type: "string" },
            },
            status: {
              type: "string",
              description: "New status to apply to the P2P Disputes",
              enum: ["PENDING", "OPEN", "RESOLVED", "CANCELLED"],
            },
          },
          required: ["ids", "status"],
        },
      },
    },
  },
  responses: updateRecordResponses("P2P Dispute"),
  requiresAuth: true,
  permission: "Access P2P Dispute Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { ids, status } = body;
  return updateStatus("p2pDispute", ids, status);
};
