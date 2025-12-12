// /server/api/p2p/trades/delete.del.ts

import {
  commonBulkDeleteParams,
  commonBulkDeleteResponses,
  handleBulkDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Bulk deletes P2P trades by IDs",
  operationId: "bulkDeleteP2PTrades",
  tags: ["Admin","P2P", "Trades"],
  parameters: commonBulkDeleteParams("P2P Trades"),
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
              description: "Array of P2P trade IDs to delete",
            },
          },
          required: ["ids"],
        },
      },
    },
  },
  responses: commonBulkDeleteResponses("P2P Trades"),
  requiresAuth: true,
  permission: "Access P2P Trade Management",
};

export default async (data: Handler) => {
  const { body, query } = data;
  const { ids } = body;
  return handleBulkDelete({
    model: "p2pTrade",
    ids,
    query,
  });
};
