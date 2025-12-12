import { updateRecordResponses, updateStatus } from "@b/utils/query";

export const metadata = {
  summary: "Bulk updates the status of P2P Payment Methods",
  operationId: "bulkUpdateP2pPaymentMethodStatus",
  tags: ["Admin", "P2P Payment Methods"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            ids: {
              type: "array",
              description: "Array of P2P Payment Method IDs to update",
              items: { type: "string" },
            },
            status: {
              type: "boolean",
              description: "New status to apply to the P2P Payment Methods",
            },
          },
          required: ["ids", "status"],
        },
      },
    },
  },
  responses: updateRecordResponses("P2P Payment Method"),
  requiresAuth: true,
  permission: "Access P2P Payment Method Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { ids, status } = body;
  return updateStatus("p2pPaymentMethod", ids, status);
};
