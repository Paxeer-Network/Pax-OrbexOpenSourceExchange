import { updateRecordResponses, updateStatus } from "@b/utils/query";

export const metadata = {
  summary: "Bulk updates the status of Staking Logs",
  operationId: "bulkUpdateStakingLogStatus",
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
              description: "Array of Staking Log IDs to update",
              items: { type: "string" },
            },
            status: {
              type: "string",
              enum: ["ACTIVE", "RELEASED", "COLLECTED"],
              description: "New status to apply to the Staking Logs",
            },
          },
          required: ["ids", "status"],
        },
      },
    },
  },
  responses: updateRecordResponses("StakingLog"),
  requiresAuth: true,
  permission: "Access Staking Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { ids, status } = body;
  return updateStatus("stakingLog", ids, status);
};
