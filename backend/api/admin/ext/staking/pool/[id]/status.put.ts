import { updateStatus, updateRecordResponses } from "@b/utils/query";

export const metadata = {
  summary: "Update Status for a Staking Pool",
  operationId: "updateStakingPoolStatus",
  tags: ["Admin", "Staking"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the Staking Pool to update",
      schema: { type: "string" },
    },
  ],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            status: {
              type: "string",
              enum: ["ACTIVE", "INACTIVE", "COMPLETED"],
              description: "New status to apply to the Staking Pool",
            },
          },
          required: ["status"],
        },
      },
    },
  },
  responses: updateRecordResponses("Staking Pool"),
  requiresAuth: true,
  permission: "Access Staking Pool Management",
};

export default async (data) => {
  const { body, params } = data;
  const { id } = params;
  const { status } = body;
  return updateStatus("stakingPool", id, status);
};
