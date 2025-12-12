import { updateRecord, updateRecordResponses } from "@b/utils/query";
import { stakingPoolUpdateSchema } from "../utils";

export const metadata = {
  summary: "Updates a specific Staking Pool",
  operationId: "updateStakingPool",
  tags: ["Admin", "Staking"],
  parameters: [
    {
      name: "id",
      in: "path",
      description: "ID of the Staking Pool to update",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    description: "New data for the Staking Pool",
    required: true,
    content: {
      "application/json": {
        schema: stakingPoolUpdateSchema,
      },
    },
  },
  responses: updateRecordResponses("StakingPool"),
  requiresAuth: true,
  permission: "Access Staking Pool Management",
};

export default async (data) => {
  const { body, params } = data;
  const { id } = params;
  const updatedFields = {
    name: body.name,
    description: body.description,
    currency: body.currency ? body.currency.toUpperCase() : undefined,
    chain: body.chain ? body.chain.toUpperCase() : undefined,
    type: body.type,
    minStake: body.minStake,
    maxStake: body.maxStake,
    status: body.status,
    icon: body.icon,
  };

  return await updateRecord("stakingPool", id, updatedFields);
};
