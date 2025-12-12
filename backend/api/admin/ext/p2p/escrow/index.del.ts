// /server/api/p2p/escrows/delete.del.ts

import {
  commonBulkDeleteParams,
  commonBulkDeleteResponses,
  handleBulkDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Bulk deletes P2P escrows by IDs",
  operationId: "bulkDeleteP2PEscrows",
  tags: ["Admin","P2P", "Escrows"],
  parameters: commonBulkDeleteParams("P2P Escrows"),
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
              description: "Array of P2P escrow IDs to delete",
            },
          },
          required: ["ids"],
        },
      },
    },
  },
  responses: commonBulkDeleteResponses("P2P Escrows"),
  requiresAuth: true,
  permission: "Access P2P Escrow Management",
};

export default async (data: Handler) => {
  const { body, query } = data;
  const { ids } = body;
  return handleBulkDelete({
    model: "p2pEscrow",
    ids,
    query,
  });
};
