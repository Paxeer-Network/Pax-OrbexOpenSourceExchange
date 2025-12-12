import { models } from "@b/db";
import { updateRecordResponses } from "@b/utils/query";

export const metadata = {
  summary: "Updates the status of a P2P Offer",
  operationId: "updateP2POfferStatus",
  tags: ["USER", "P2P", "Offers"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the P2P offer to update",
      schema: { type: "string" },
    },
  ],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            status: {
              type: "string",
              enum: ["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"],
              description: "New status to apply",
            },
          },
          required: ["status"],
        },
      },
    },
  },
  responses: updateRecordResponses("P2P Offer"),
  requiresAuth: true,
};

export default async (data) => {
  const { body, params, user } = data;
  const { id } = params;
  const { status } = body;

  const offer = await models.p2pOffer.findOne({
    where: { id, userId: user.id },
  });

  if (!offer) {
    throw new Error("Offer not found");
  }

  offer.status = status;
  await offer.save();

  return {
    message: "Offer status updated successfully",
  };
};
