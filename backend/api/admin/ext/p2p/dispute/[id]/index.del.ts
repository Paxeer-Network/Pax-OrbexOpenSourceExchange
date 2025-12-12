import {
  deleteRecordParams,
  deleteRecordResponses,
  handleSingleDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Deletes a specific P2P dispute",
  operationId: "deleteP2PDispute",
  tags: ["Admin","P2P", "Disputes"],
  parameters: deleteRecordParams("P2P dispute"),
  responses: deleteRecordResponses("P2P dispute"),
  permission: "Access P2P Dispute Management",
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { params, query } = data;
  return handleSingleDelete({
    model: "p2pDispute",
    id: params.id,
    query,
  });
};
