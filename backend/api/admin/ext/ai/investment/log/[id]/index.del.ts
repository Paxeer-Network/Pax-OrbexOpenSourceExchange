import { models } from "@b/db";
import {
  deleteRecordParams,
  deleteRecordResponses,
  handleSingleDelete,
} from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Deletes a specific AI Investment",
  operationId: "deleteAIInvestment",
  tags: ["Admin", "AI Investment"],
  parameters: deleteRecordParams("AI Investment"),
  responses: deleteRecordResponses("AI Investment"),
  permission: "Access AI Investment Management",
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { params, query } = data;

  const externalData: { walletId?: string; transactionId?: string } = {};

  const preDelete = async () => {
    const transaction = await models.transaction.findOne({
      where: { referenceId: params.id },
      include: [{ model: models.wallet }],
    });

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    const { wallet } = transaction;

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    // Calculate new balance, assuming transaction.amount needs to be added back to the wallet.
    const newBalance = wallet.balance + transaction.amount;

    // Update wallet balance
    await models.wallet.update(
      { balance: newBalance },
      { where: { id: wallet.id } }
    );

    // Store transaction ID for later use in postDelete
    externalData.transactionId = transaction.id;
  };

  const postDelete = async () => {
    // Delete transaction record after updating the wallet
    if (externalData.transactionId) {
      await models.transaction.destroy({
        where: { id: externalData.transactionId },
      });
    }
  };

  return await handleSingleDelete({
    model: "aiInvestment",
    id: params.id,
    query,
    preDelete,
    postDelete,
  });
};
