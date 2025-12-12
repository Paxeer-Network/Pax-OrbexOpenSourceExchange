import { updateRecord, updateRecordResponses } from "@b/utils/query";
import { p2pEscrowUpdateSchema } from "../utils";

export const metadata = {
  summary: "Updates a specific P2P Escrow",
  operationId: "updateP2pEscrow",
  tags: ["Admin","P2P Escrow"],
  parameters: [
    {
      name: "id",
      in: "path",
      description: "ID of the P2P Escrow to update",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    description: "New data for the P2P Escrow",
    content: {
      "application/json": {
        schema: p2pEscrowUpdateSchema,
      },
    },
  },
  responses: updateRecordResponses("P2P Escrow"),
  requiresAuth: true,
  permission: "Access P2P Escrow Management",
};

export default async (data) => {
  const { body, params } = data;
  const { id } = params;
  const updatedFields = {
    status: body.status,
    amount: body.amount,
  };

  return await updateRecord("p2pEscrow", id, updatedFields);
};
