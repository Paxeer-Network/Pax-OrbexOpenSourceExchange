import {
  deleteRecordParams,
  deleteRecordResponses,
  handleSingleDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Deletes a specific P2P trade",
  operationId: "deleteP2PTrade",
  tags: ["Admin","P2P", "Trades"],
  parameters: deleteRecordParams("P2P trade"),
  responses: deleteRecordResponses("P2P trade"),
  permission: "Access P2P Trade Management",
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { params, query } = data;
  return handleSingleDelete({
    model: "p2pTrade",
    id: params.id,
    query,
  });
};
