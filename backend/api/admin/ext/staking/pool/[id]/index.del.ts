import {
  deleteRecordParams,
  deleteRecordResponses,
  handleSingleDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Deletes a specific staking pool",
  operationId: "deleteStakingPool",
  tags: ["Admin","Staking", "Pools"],
  parameters: deleteRecordParams("Staking pool"),
  responses: deleteRecordResponses("Staking pool"),
  permission: "Access Staking Pool Management",
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { params, query } = data;
  return handleSingleDelete({
    model: "stakingPool",
    id: params.id,
    query,
  });
};
