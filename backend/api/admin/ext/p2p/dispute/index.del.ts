// /server/api/p2p/disputes/delete.del.ts

import {
  commonBulkDeleteParams,
  commonBulkDeleteResponses,
  handleBulkDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Bulk deletes P2P disputes by IDs",
  operationId: "bulkDeleteP2PDisputes",
  tags: ["Admin","P2P", "Disputes"],
  parameters: commonBulkDeleteParams("P2P Disputes"),
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
              description: "Array of P2P dispute IDs to delete",
            },
          },
          required: ["ids"],
        },
      },
    },
  },
  responses: commonBulkDeleteResponses("P2P Disputes"),
  requiresAuth: true,
  permission: "Access P2P Dispute Management",
};

export default async (data: Handler) => {
  const { body, query } = data;
  const { ids } = body;
  return handleBulkDelete({
    model: "p2pDispute",
    ids,
    query,
  });
};
