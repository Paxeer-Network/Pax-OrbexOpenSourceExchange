import { models } from "@b/db";
import {
  commonBulkDeleteParams,
  commonBulkDeleteResponses,
  handleBulkDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Bulk deletes P2P offers by IDs",
  operationId: "bulkDeleteP2POffers",
  tags: ["Admin", "P2P", "Offers"],
  parameters: commonBulkDeleteParams("P2P Offers"),
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            ids: {
              type: "array",
              items: { type: "string" },
              description: "Array of P2P offer IDs to delete",
            },
          },
          required: ["ids"],
        },
      },
    },
  },
  responses: commonBulkDeleteResponses("P2P Offers"),
  requiresAuth: true,
  permission: "Access P2P Offer Management",
};

export default async (data: Handler) => {
  const { body, query } = data;
  const { ids } = body;

  const preDelete = async () => {
    for (const id of ids) {
      const offer = await models.p2pOffer.findOne({
        where: { id },
        include: [
          {
            model: models.user,
            attributes: ["id"],
            as: "user",
          },
        ],
      });

      if (offer) {
        const wallet = await models.wallet.findOne({
          where: {
            userId: offer.userId,
            type: offer.walletType,
            currency: offer.currency,
          },
        });

        if (wallet) {
          const newBalance = wallet.balance + offer.amount;

          // Update the wallet balance
          await models.wallet.update(
            { balance: newBalance },
            { where: { id: wallet.id } }
          );
        }
      }
    }
  };

  const postDelete = async () => {
    // Implement if there are any specific actions needed after deleting offers
  };

  return handleBulkDelete({
    model: "p2pOffer",
    ids,
    query,
    preDelete,
    postDelete,
  });
};
