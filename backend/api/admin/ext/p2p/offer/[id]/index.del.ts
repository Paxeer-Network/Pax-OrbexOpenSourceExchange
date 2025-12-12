import { models } from "@b/db";
import {
  deleteRecordParams,
  deleteRecordResponses,
  handleSingleDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Deletes a specific P2P offer",
  operationId: "deleteP2POffer",
  tags: ["Admin", "P2P", "Offers"],
  parameters: deleteRecordParams("P2P offer"),
  responses: deleteRecordResponses("P2P offer"),
  permission: "Access P2P Offer Management",
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { params, query } = data;

  const preDelete = async () => {
    const offer = await models.p2pOffer.findOne({
      where: { id: params.id },
      include: [
        {
          model: models.user,
          attributes: ["id"],
          as: "user",
        },
      ],
    });

    if (!offer) {
      throw new Error("Offer not found");
    }

    const wallet = await models.wallet.findOne({
      where: {
        userId: offer.userId, // Assuming this field exists and is named correctly
        type: offer.walletType, // Make sure the field names are correctly camelCased as per Sequelize model definitions
        currency: offer.currency,
      },
    });

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    // Update the wallet balance by incrementing it with the offer amount
    await models.wallet.update(
      {
        balance: wallet.balance + offer.amount, // Sequelize doesn't support increment in the update method directly
      },
      {
        where: { id: wallet.id },
      }
    );
  };

  const postDelete = async () => {
    // No additional post-delete logic needed unless specified
  };

  return await handleSingleDelete({
    model: "p2pOffer",
    id: params.id,
    query,
    preDelete,
    postDelete,
  });
};
