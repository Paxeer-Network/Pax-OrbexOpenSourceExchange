import { updateRecord, updateRecordResponses } from "@b/utils/query";
import { stakingLogUpdateSchema } from "../utils";

export const metadata = {
  summary: "Updates a specific Staking Log",
  operationId: "updateStakingLog",
  tags: ["Admin","Staking"],
  parameters: [
    {
      name: "id",
      in: "path",
      description: "ID of the Staking Log to update",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    description: "New data for the Staking Log",
    required: true,
    content: {
      "application/json": {
        schema: stakingLogUpdateSchema,
      },
    },
  },
  responses: updateRecordResponses("StakingLog"),
  requiresAuth: true,
  permission: "Access Staking Management",
};

export default async (data) => {
  const { body, params } = data;
  const { id } = params;
  const updatedFields = {
    userId: body.userId,
    poolId: body.poolId,
    durationId: body.durationId,
    amount: body.amount,
    status: body.status,
  };

  return await updateRecord("stakingLog", id, updatedFields);
};
