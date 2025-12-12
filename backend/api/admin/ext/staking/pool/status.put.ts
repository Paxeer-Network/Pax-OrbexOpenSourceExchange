import { updateRecordResponses, updateStatus } from "@b/utils/query";

export const metadata = {
  summary: "Bulk Update Status for Staking Pools",
  operationId: "bulkUpdateStakingPoolStatus",
  tags: ["Admin", "Staking"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            ids: {
              type: "array",
              description: "Array of Staking Pool IDs to update",
              items: { type: "string" },
            },
            status: {
              type: "string",
              enum: ["ACTIVE", "INACTIVE", "COMPLETED"],
              description: "New status to apply to the staking pools",
            },
          },
          required: ["ids", "status"],
        },
      },
    },
  },
  responses: updateRecordResponses("StakingPool"),
  requiresAuth: true,
  permission: "Access Staking Pool Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { ids, status } = body;
  return updateStatus("stakingPool", ids, status);
};
