import {
  deleteRecordParams,
  deleteRecordResponses,
  handleSingleDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Deletes a specific P2P payment method",
  operationId: "deleteP2PPaymentMethod",
  tags: ["Admin", "P2P Payment Methods"],
  parameters: deleteRecordParams("P2P payment method"),
  responses: deleteRecordResponses("P2P payment method"),
  permission: "Access P2P Payment Method Management",
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { params, query } = data;
  return handleSingleDelete({
    model: "p2pPaymentMethod",
    id: params.id,
    query,
  });
};
