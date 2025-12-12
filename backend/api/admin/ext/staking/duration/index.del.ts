// /server/api/staking/durations/delete.del.ts

import {
  commonBulkDeleteParams,
  commonBulkDeleteResponses,
  handleBulkDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Bulk deletes staking durations by IDs",
  operationId: "bulkDeleteStakingDurations",
  tags: ["Admin","Staking", "Durations"],
  parameters: commonBulkDeleteParams("Staking Durations"),
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
              description: "Array of staking duration IDs to delete",
            },
          },
          required: ["ids"],
        },
      },
    },
  },
  responses: commonBulkDeleteResponses("Staking Durations"),
  requiresAuth: true,
  permission: "Access Staking Duration Management",
};

export default async (data: Handler) => {
  const { body, query } = data;
  const { ids } = body;
  return handleBulkDelete({
    model: "stakingDuration",
    ids,
    query,
  });
};
