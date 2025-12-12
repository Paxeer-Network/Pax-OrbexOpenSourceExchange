import { models } from "@b/db";
import {
  commonBulkDeleteParams,
  commonBulkDeleteResponses,
  handleBulkDelete,
} from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Bulk deletes AI Investments by IDs",
  operationId: "bulkDeleteAIInvestments",
  tags: ["Admin", "AI Investment"],
  parameters: commonBulkDeleteParams("AI Investments"),
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
              description: "Array of AI Investment IDs to delete",
            },
          },
          required: ["ids"],
        },
      },
    },
  },
  responses: commonBulkDeleteResponses("AI Investments"),
  requiresAuth: true,
  permission: "Access AI Investment Management",
};

export default async (data: Handler) => {
  const { body, query } = data;
  const { ids } = body;

  // You can define preDelete and postDelete to handle each ID similarly
  const preDelete = async () => {
    // Perform all pre-deletion logic for each ID
    for (const id of ids) {
      const transaction = await models.transaction.findOne({
        where: { referenceId: id },
        include: [{ model: models.wallet }],
      });

      if (transaction && transaction.wallet) {
        const newBalance = transaction.wallet.balance + transaction.amount;

        // Update wallet balance
        await models.wallet.update(
          { balance: newBalance },
          { where: { id: transaction.wallet.id } }
        );
      }
    }
  };

  const postDelete = async () => {
    // Delete transaction records after wallets have been updated
    for (const id of ids) {
      await models.transaction.destroy({
        where: { referenceId: id },
      });
    }
  };

  return handleBulkDelete({
    model: "aiInvestment",
    ids,
    query,
    preDelete,
    postDelete,
  });
};
