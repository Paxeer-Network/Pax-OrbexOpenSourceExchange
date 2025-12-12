import { updateRecord, updateRecordResponses } from "@b/utils/query";
import { p2pOfferUpdateSchema } from "../utils";

export const metadata = {
  summary: "Updates a specific P2P Offer",
  operationId: "updateP2pOffer",
  tags: ["Admin","P2P Offer"],
  parameters: [
    {
      name: "id",
      in: "path",
      description: "ID of the P2P Offer to update",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    description: "New data for the P2P Offer",
    content: {
      "application/json": {
        schema: p2pOfferUpdateSchema,
      },
    },
  },
  responses: updateRecordResponses("P2P Offer"),
  requiresAuth: true,
  permission: "Access P2P Offer Management",
};

export default async (data) => {
  const { body, params } = data;
  const { id } = params;
  const updatedFields = {
    status: body.status,
    amount: body.amount,
    minAmount: body.minAmount,
    maxAmount: body.maxAmount,
    price: body.price,
  };

  return await updateRecord("p2pOffer", id, updatedFields);
};
