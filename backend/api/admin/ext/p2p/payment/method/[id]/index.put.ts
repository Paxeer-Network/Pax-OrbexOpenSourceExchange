import { updateRecord, updateRecordResponses } from "@b/utils/query";
import { p2pPaymentMethodUpdateSchema } from "../utils";

export const metadata = {
  summary: "Updates a specific P2P Payment Method",
  operationId: "updateP2pPaymentMethod",
  tags: ["Admin","P2P Payment Method"],
  parameters: [
    {
      name: "id",
      in: "path",
      description: "ID of the P2P Payment Method to update",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    description: "New data for the P2P Payment Method",
    content: {
      "application/json": {
        schema: p2pPaymentMethodUpdateSchema,
      },
    },
  },
  responses: updateRecordResponses("P2P Payment Method"),
  requiresAuth: true,
  permission: "Access P2P Payment Method Management",
};

export default async (data) => {
  const { body, params } = data;
  const { id } = params;
  const updatedFields = {
    name: body.name,
    instructions: body.instructions,
    walletType: body.walletType,
    chain: body.chain,
    currency: body.currency,
    image: body.image,
    status: body.status,
  };

  return await updateRecord("p2pPaymentMethod", id, updatedFields);
};
