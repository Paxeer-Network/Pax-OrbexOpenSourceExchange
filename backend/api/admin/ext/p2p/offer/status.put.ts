import { updateRecordResponses, updateStatus } from "@b/utils/query";

export const metadata = {
  summary: "Bulk updates the status of P2P Offers",
  operationId: "bulkUpdateP2pOfferStatus",
  tags: ["Admin", "P2P Offers"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            ids: {
              type: "array",
              description: "Array of P2P Offer IDs to update",
              items: { type: "string" },
            },
            status: {
              type: "string",
              description: "New status to apply to the P2P Offers",
              enum: ["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"],
            },
          },
          required: ["ids", "status"],
        },
      },
    },
  },
  responses: updateRecordResponses("P2P Offer"),
  requiresAuth: true,
  permission: "Access P2P Offer Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { ids, status } = body;
  return updateStatus("p2pOffer", ids, status);
};
