// /server/api/staking/logs/delete.del.ts

import {
  commonBulkDeleteParams,
  commonBulkDeleteResponses,
  handleBulkDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Bulk deletes staking logs by IDs",
  operationId: "bulkDeleteStakingLogs",
  tags: ["Admin","Staking", "Logs"],
  parameters: commonBulkDeleteParams("Staking Logs"),
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
              description: "Array of staking log IDs to delete",
            },
          },
          required: ["ids"],
        },
      },
    },
  },
  responses: commonBulkDeleteResponses("Staking Logs"),
  requiresAuth: true,
  permission: "Access Staking Management",
};

export default async (data: Handler) => {
  const { body, query } = data;
  const { ids } = body;
  return handleBulkDelete({
    model: "stakingLog",
    ids,
    query,
  });
};
