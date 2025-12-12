// /server/api/ico/tokens/delete.del.ts

import {
  commonBulkDeleteParams,
  commonBulkDeleteResponses,
  handleBulkDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Bulk deletes ICO tokens by IDs",
  operationId: "bulkDeleteIcoTokens",
  tags: ["Admin","ICO", "Tokens"],
  parameters: commonBulkDeleteParams("ICO Tokens"),
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
              description: "Array of ICO token IDs to delete",
            },
          },
          required: ["ids"],
        },
      },
    },
  },
  responses: commonBulkDeleteResponses("ICO Tokens"),
  requiresAuth: true,
  permission: "Access ICO Token Management",
};

export default async (data: Handler) => {
  const { body, query } = data;
  const { ids } = body;
  return handleBulkDelete({
    model: "icoToken",
    ids,
    query,
  });
};
