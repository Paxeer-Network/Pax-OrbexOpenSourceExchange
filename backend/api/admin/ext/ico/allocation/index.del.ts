// /server/api/ico/allocations/delete.del.ts

import {
  commonBulkDeleteParams,
  commonBulkDeleteResponses,
  handleBulkDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Bulk deletes ICO allocations by IDs",
  operationId: "bulkDeleteIcoAllocations",
  tags: ["Admin","ICO", "Allocations"],
  parameters: commonBulkDeleteParams("ICO Allocations"),
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
              description: "Array of ICO allocation IDs to delete",
            },
          },
          required: ["ids"],
        },
      },
    },
  },
  responses: commonBulkDeleteResponses("ICO Allocations"),
  requiresAuth: true,
  permission: "Access ICO Allocation Management",
};

export default async (data: Handler) => {
  const { body, query } = data;
  const { ids } = body;
  return handleBulkDelete({
    model: "icoAllocation",
    ids,
    query,
  });
};
