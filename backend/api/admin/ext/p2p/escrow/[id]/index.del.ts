import {
  deleteRecordParams,
  deleteRecordResponses,
  handleSingleDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Deletes a specific P2P escrow",
  operationId: "deleteP2PEscrow",
  tags: ["Admin","P2P", "Escrows"],
  parameters: deleteRecordParams("P2P escrow"),
  responses: deleteRecordResponses("P2P escrow"),
  permission: "Access P2P Escrow Management",
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { params, query } = data;
  return handleSingleDelete({
    model: "p2pEscrow",
    id: params.id,
    query,
  });
};
