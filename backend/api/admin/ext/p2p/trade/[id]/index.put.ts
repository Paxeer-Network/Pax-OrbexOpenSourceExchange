import { updateRecord, updateRecordResponses } from "@b/utils/query";
import { p2pTradeUpdateSchema } from "../utils";

export const metadata = {
  summary: "Updates a specific P2P Trade",
  operationId: "updateP2pTrade",
  tags: ["Admin","P2P Trade"],
  parameters: [
    {
      name: "id",
      in: "path",
      description: "ID of the P2P Trade to update",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    description: "New data for the P2P Trade",
    content: {
      "application/json": {
        schema: p2pTradeUpdateSchema,
      },
    },
  },
  responses: updateRecordResponses("P2P Trade"),
  requiresAuth: true,
  permission: "Access P2P Trade Management",
};

export default async (data) => {
  const { body, params } = data;
  const { id } = params;
  const updatedFields = {
    status: body.status,
    messages: body.messages,
    txHash: body.txHash,
  };

  return await updateRecord("p2pTrade", id, updatedFields);
};
