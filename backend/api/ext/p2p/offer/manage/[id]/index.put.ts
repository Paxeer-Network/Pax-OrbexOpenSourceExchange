import { updateRecord, updateRecordResponses } from "@b/utils/query";
import { p2pOfferUpdateSchema } from "../../utils";

export const metadata: OperationObject = {
  summary: "Updates a specific P2P Offer",
  operationId: "updateP2pOffer",
  tags: ["P2P Offer"],
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
};

export default async (data) => {
  const { body, params } = data;
  const { id } = params;
  const updatedFields = {
    status: body.status,
    paymentMethodId: body.paymentMethodId,
    minAmount: body.minAmount,
    maxAmount: body.maxAmount,
    price: body.price,
  };

  return await updateRecord("p2pOffer", id, updatedFields);
};
