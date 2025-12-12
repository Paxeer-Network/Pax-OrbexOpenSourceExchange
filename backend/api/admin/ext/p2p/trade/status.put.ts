import { updateRecordResponses, updateStatus } from "@b/utils/query";

export const metadata = {
  summary: "Bulk updates the status of P2P Trades",
  operationId: "bulkUpdateP2pTradeStatus",
  tags: ["Admin", "P2P Trades"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            ids: {
              type: "array",
              description: "Array of P2P Trade IDs to update",
              items: { type: "string" },
            },
            status: {
              type: "string",
              enum: [
                "PENDING",
                "PAID",
                "DISPUTE_OPEN",
                "ESCROW_REVIEW",
                "CANCELLED",
                "COMPLETED",
                "REFUNDED",
              ],
              description: "New status to apply to the P2P Trades",
            },
          },
          required: ["ids", "status"],
        },
      },
    },
  },
  responses: updateRecordResponses("P2P Trade"),
  requiresAuth: true,
  permission: "Access P2P Trade Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { ids, status } = body;
  return updateStatus("p2pTrade", ids, status);
};
