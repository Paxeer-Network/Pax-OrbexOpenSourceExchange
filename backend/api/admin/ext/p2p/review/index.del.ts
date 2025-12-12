// /server/api/p2p/reviews/delete.del.ts

import {
  commonBulkDeleteParams,
  commonBulkDeleteResponses,
  handleBulkDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Bulk deletes P2P reviews by IDs",
  operationId: "bulkDeleteP2PReviews",
  tags: ["Admin","P2P", "Reviews"],
  parameters: commonBulkDeleteParams("P2P Reviews"),
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
              description: "Array of P2P review IDs to delete",
            },
          },
          required: ["ids"],
        },
      },
    },
  },
  responses: commonBulkDeleteResponses("P2P Reviews"),
  requiresAuth: true,
  permission: "Access P2P Review Management",
};

export default async (data: Handler) => {
  const { body, query } = data;
  const { ids } = body;
  return handleBulkDelete({
    model: "p2pReview",
    ids,
    query,
  });
};
