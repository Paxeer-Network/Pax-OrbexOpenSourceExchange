import {
  deleteRecordParams,
  deleteRecordResponses,
  handleSingleDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Deletes a specific staking log",
  operationId: "deleteStakingLog",
  tags: ["Admin","Staking", "Logs"],
  parameters: deleteRecordParams("Staking log"),
  responses: deleteRecordResponses("Staking log"),
  permission: "Access Staking Management",
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { params, query } = data;
  return handleSingleDelete({
    model: "stakingLog",
    id: params.id,
    query,
  });
};
