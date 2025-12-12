// /server/api/p2p/payment-methods/delete.del.ts

import {
  commonBulkDeleteParams,
  commonBulkDeleteResponses,
  handleBulkDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Bulk deletes P2P payment methods by IDs",
  operationId: "bulkDeleteP2PPaymentMethods",
  tags: ["Admin", "P2P Payment Methods"],
  parameters: commonBulkDeleteParams("P2P Payment Methods"),
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            ids: {
              type: "array",
              items: { type: "string" },
              description: "Array of P2P payment method IDs to delete",
            },
          },
          required: ["ids"],
        },
      },
    },
  },
  responses: commonBulkDeleteResponses("P2P Payment Methods"),
  requiresAuth: true,
  permission: "Access P2P Payment Method Management",
};

export default async (data: Handler) => {
  const { body, query } = data;
  const { ids } = body;
  return handleBulkDelete({
    model: "p2pPaymentMethod",
    ids,
    query,
  });
};
