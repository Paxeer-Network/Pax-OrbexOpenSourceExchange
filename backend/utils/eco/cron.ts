import { models } from "@b/db";
import WithdrawalQueue from "./withdrawalQueue";

export async function processPendingEcoWithdrawals() {
  try {
    // Fetch all pending withdrawal transactions for ECO wallets
    const pendingTransactions = await models.transaction.findAll({
      where: {
        type: "WITHDRAW",
        status: "PENDING",
      },
      include: [
        {
          model: models.wallet,
          as: "wallet",
          where: {
            type: "ECO",
          },
        },
      ],
    });

    if (pendingTransactions.length === 0) {
      return;
    }

    const withdrawalQueue = WithdrawalQueue.getInstance();

    for (const transaction of pendingTransactions) {
      withdrawalQueue.addTransaction(transaction.id);
    }
  } catch (error) {
    console.error(`processPendingEcoWithdrawals failed: ${error.message}`);
    // Handle the error appropriately
  }
}
