import { models } from "@b/db";
import {
  commonBulkDeleteParams,
  commonBulkDeleteResponses,
  handleBulkDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Bulk deletes ICO contributions by IDs",
  operationId: "bulkDeleteIcoContributions",
  tags: ["Admin","ICO", "Contributions"],
  parameters: commonBulkDeleteParams("ICO Contributions"),
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
              description: "Array of ICO contribution IDs to delete",
            },
          },
          required: ["ids"],
        },
      },
    },
  },
  responses: commonBulkDeleteResponses("ICO Contributions"),
  requiresAuth: true,
  permission: "Access ICO Contribution Management",
};

export default async (data: Handler) => {
  const { body, query } = data;
  const { ids } = body;

  const preDelete = async () => {
    for (const id of ids) {
      const contribution = await models.icoContribution.findOne({
        where: { id },
        include: [
          {
            model: models.icoPhase,
            as: "phase",
            include: [
              {
                model: models.icoToken,
                as: "token",
              },
            ],
          },
        ],
      });

      if (contribution) {
        const wallet = await models.wallet.findOne({
          where: {
            userId: contribution.userId,
            currency: contribution.phase.token.purchaseCurrency,
            type: contribution.phase.token.purchaseWalletType,
          },
        });

        if (wallet) {
          const newBalance = wallet.balance + contribution.amount;

          // Update wallet balance
          await models.wallet.update(
            { balance: newBalance },
            { where: { id: wallet.id } }
          );
        }
      }
    }
  };

  const postDelete = async () => {
    // Delete transaction records for all contributions
    await models.transaction.destroy({
      where: {
        referenceId: ids, // Assuming your ORM can handle array of IDs for referenceId
      },
    });
  };

  return handleBulkDelete({
    model: "icoContribution",
    ids,
    query,
    preDelete,
    postDelete,
  });
};
