import { models } from "@b/db";
import {
  deleteRecordParams,
  deleteRecordResponses,
  handleSingleDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Deletes a specific ICO contribution",
  operationId: "deleteIcoContribution",
  tags: ["Admin","ICO", "Contributions"],
  parameters: deleteRecordParams("ICO contribution"),
  responses: deleteRecordResponses("ICO contribution"),
  permission: "Access ICO Contribution Management",
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { params, query } = data;

  const externalData: { walletId?: number; contributionId?: string } = {};

  const preDelete = async () => {
    const contribution = await models.icoContribution.findOne({
      where: { id: params.id },
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

    if (!contribution) {
      throw new Error("Contribution not found");
    }

    const wallet = await models.wallet.findOne({
      where: {
        userId: contribution.userId,
        currency: contribution.phase.token.purchaseCurrency,
        type: contribution.phase.token.purchaseWalletType,
      },
    });

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    // Calculate new balance
    const newBalance = wallet.balance + contribution.amount;

    // Update wallet balance
    await models.wallet.update(
      { balance: newBalance },
      { where: { id: wallet.id } }
    );

    // Store the contribution UUID for later use in postDelete
    externalData.contributionId = contribution.id;
  };

  const postDelete = async () => {
    // Delete transaction records associated with the contribution
    if (externalData.contributionId) {
      await models.transaction.destroy({
        where: { referenceId: externalData.contributionId },
      });
    }
  };

  return await handleSingleDelete({
    model: "icoContribution",
    id: params.id,
    query,
    preDelete,
    postDelete,
  });
};
