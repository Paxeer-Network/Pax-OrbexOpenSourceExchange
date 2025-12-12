import { updateRecordResponses, updateStatus } from "@b/utils/query";

export const metadata = {
  summary: "Bulk updates the status of P2P Escrows",
  operationId: "bulkUpdateP2pEscrowStatus",
  tags: ["Admin", "P2P Escrows"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            ids: {
              type: "array",
              description: "Array of P2P Escrow IDs to update",
              items: { type: "string" },
            },
            status: {
              type: "string",
              description: "New status to apply to the P2P Escrows",
              enum: ["PENDING", "HELD", "RELEASED", "CANCELLED"],
            },
          },
          required: ["ids", "status"],
        },
      },
    },
  },
  responses: updateRecordResponses("P2P Escrow"),
  requiresAuth: true,
  permission: "Access P2P Escrow Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { ids, status } = body;
  return updateStatus("p2pEscrow", ids, status);
};
