// /server/api/p2p/commissions/delete.del.ts

import {
  commonBulkDeleteParams,
  commonBulkDeleteResponses,
  handleBulkDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Bulk deletes P2P commissions by IDs",
  operationId: "bulkDeleteP2PCommissions",
  tags: ["Admin","P2P", "Commissions"],
  parameters: commonBulkDeleteParams("P2P Commissions"),
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
              description: "Array of P2P commission IDs to delete",
            },
          },
          required: ["ids"],
        },
      },
    },
  },
  responses: commonBulkDeleteResponses("P2P Commissions"),
  requiresAuth: true,
  permission: "Access P2P Commission Management",
};

export default async (data: Handler) => {
  const { body, query } = data;
  const { ids } = body;
  return handleBulkDelete({
    model: "p2pCommission",
    ids,
    query,
  });
};
