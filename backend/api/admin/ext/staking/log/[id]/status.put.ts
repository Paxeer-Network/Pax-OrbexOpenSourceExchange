import { updateStatus, updateRecordResponses } from "@b/utils/query";

export const metadata = {
  summary: "Update Status for a Staking Log",
  operationId: "updateStakingLogStatus",
  tags: ["Admin", "Staking"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the Staking Log to update",
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
              enum: ["ACTIVE", "RELEASED", "COLLECTED"],
              description: "New status to apply to the Staking Log",
            },
          },
          required: ["status"],
        },
      },
    },
  },
  responses: updateRecordResponses("Staking Log"),
  requiresAuth: true,
  permission: "Access Staking Management",
};

export default async (data) => {
  const { body, params } = data;
  const { id } = params;
  const { status } = body;
  return updateStatus("stakingLog", id, status);
};
