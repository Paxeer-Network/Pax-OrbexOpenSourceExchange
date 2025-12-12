// /server/api/ico/phases/delete.del.ts

import {
  commonBulkDeleteParams,
  commonBulkDeleteResponses,
  handleBulkDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Bulk deletes ICO phases by IDs",
  operationId: "bulkDeleteIcoPhases",
  tags: ["Admin","ICO", "Phases"],
  parameters: commonBulkDeleteParams("ICO Phases"),
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
              description: "Array of ICO phase IDs to delete",
            },
          },
          required: ["ids"],
        },
      },
    },
  },
  responses: commonBulkDeleteResponses("ICO Phases"),
  requiresAuth: true,
  permission: "Access ICO Phase Management",
};

export default async (data: Handler) => {
  const { body, query } = data;
  const { ids } = body;
  return handleBulkDelete({
    model: "icoPhase",
    ids,
    query,
  });
};
