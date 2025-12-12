import {
  deleteRecordParams,
  deleteRecordResponses,
  handleSingleDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Deletes a specific P2P commission",
  operationId: "deleteP2PCommission",
  tags: ["Admin","P2P", "Commissions"],
  parameters: deleteRecordParams("P2P commission"),
  responses: deleteRecordResponses("P2P commission"),
  permission: "Access P2P Commission Management",
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { params, query } = data;
  return handleSingleDelete({
    model: "p2pCommission",
    id: params.id,
    query,
  });
};
