import { updateRecord, updateRecordResponses } from "@b/utils/query";
import { p2pCommissionUpdateSchema } from "../utils";

export const metadata = {
  summary: "Updates a specific P2P Commission",
  operationId: "updateP2pCommission",
  tags: ["Admin","P2P Commissions"],
  parameters: [
    {
      name: "id",
      in: "path",
      description: "ID of the P2P Commission to update",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    description: "New data for the P2P Commission",
    content: {
      "application/json": {
        schema: p2pCommissionUpdateSchema,
      },
    },
  },
  responses: updateRecordResponses("P2P Commission"),
  requiresAuth: true,
  permission: "Access P2P Commission Management",
};

export default async (data) => {
  const { body, params } = data;
  const { id } = params;
  const updatedFields = {
    amount: body.amount,
  };

  return await updateRecord("p2pCommission", id, updatedFields);
};
