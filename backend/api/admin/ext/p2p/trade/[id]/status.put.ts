import { updateStatus, updateRecordResponses } from "@b/utils/query";

export const metadata = {
  summary: "Updates the status of a P2P Trade",
  operationId: "updateP2PTradeStatus",
  tags: ["Admin","P2P", "Trades"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the P2P trade to update",
      schema: { type: "string" },
    },
  ],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
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
              description: "New status to apply",
            },
          },
          required: ["status"],
        },
      },
    },
  },
  responses: updateRecordResponses("P2P Trade"),
  requiresAuth: true,
  permission: "Access P2P Trade Management",
};

export default async (data) => {
  const { body, params } = data;
  const { id } = params;
  const { status } = body;
  return updateStatus("p2pTrade", id, status);
};
