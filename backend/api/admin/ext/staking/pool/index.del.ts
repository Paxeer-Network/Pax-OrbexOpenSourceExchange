// /server/api/staking/pools/delete.del.ts

import {
  commonBulkDeleteParams,
  commonBulkDeleteResponses,
  handleBulkDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Bulk deletes staking pools by IDs",
  operationId: "bulkDeleteStakingPools",
  tags: ["Admin","Staking", "Pools"],
  parameters: commonBulkDeleteParams("Staking Pools"),
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
              description: "Array of staking pool IDs to delete",
            },
          },
          required: ["ids"],
        },
      },
    },
  },
  responses: commonBulkDeleteResponses("Staking Pools"),
  requiresAuth: true,
  permission: "Access Staking Pool Management",
};

export default async (data: Handler) => {
  const { body, query } = data;
  const { ids } = body;
  return handleBulkDelete({
    model: "stakingPool",
    ids,
    query,
  });
};
