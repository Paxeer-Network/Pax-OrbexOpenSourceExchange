import { updateRecord, updateRecordResponses } from "@b/utils/query";
import { stakingDurationUpdateSchema } from "../utils";

export const metadata = {
  summary: "Updates a specific Staking Duration",
  operationId: "updateStakingDuration",
  tags: ["Admin","Staking"],
  parameters: [
    {
      name: "id",
      in: "path",
      description: "ID of the Staking Duration to update",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    description: "New data for the Staking Duration",
    required: true,
    content: {
      "application/json": {
        schema: stakingDurationUpdateSchema,
      },
    },
  },
  responses: updateRecordResponses("StakingDuration"),
  requiresAuth: true,
  permission: "Access Staking Duration Management",
};

export default async (data) => {
  const { body, params } = data;
  const { id } = params;
  const updatedFields = {
    poolId: body.poolId,
    duration: body.duration,
    interestRate: body.interestRate,
  };

  return await updateRecord("stakingDuration", id, updatedFields);
};
