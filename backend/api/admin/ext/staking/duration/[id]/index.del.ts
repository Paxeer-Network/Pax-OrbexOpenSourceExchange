import {
  deleteRecordParams,
  deleteRecordResponses,
  handleSingleDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Deletes a specific staking duration",
  operationId: "deleteStakingDuration",
  tags: ["Admin","Staking", "Durations"],
  parameters: deleteRecordParams("Staking duration"),
  responses: deleteRecordResponses("Staking duration"),
  permission: "Access Staking Duration Management",
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { params, query } = data;
  return handleSingleDelete({
    model: "stakingDuration",
    id: params.id,
    query,
  });
};
