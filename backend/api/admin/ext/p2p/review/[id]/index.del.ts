import {
  deleteRecordParams,
  deleteRecordResponses,
  handleSingleDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Deletes a specific P2P review",
  operationId: "deleteP2PReview",
  tags: ["Admin","P2P", "Reviews"],
  parameters: deleteRecordParams("P2P review"),
  responses: deleteRecordResponses("P2P review"),
  permission: "Access P2P Review Management",
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { params, query } = data;
  return handleSingleDelete({
    model: "p2pReview",
    id: params.id,
    query,
  });
};
