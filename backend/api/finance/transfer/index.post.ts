import { models, sequelize } from "@b/db";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { createError } from "@b/utils/error";
import { getWalletByUserIdAndCurrency } from "@b/utils/eco/wallet";
import {
  calculateNewBalance,
  calculateTransferFee,
  createTransferTransaction,
  getCurrencyData,
  getSortedChainBalances,
  recordAdminProfit,
  requiresPrivateLedgerUpdate,
  sendTransferEmails,
  updatePrivateLedger,
  updateWalletBalances,
} from "./utils";
import { CacheManager } from "@b/utils/cache";

export const metadata: OperationObject = {
  summary: "Performs a transfer transaction",
  description:
    "Initiates a transfer transaction for the currently authenticated user",
  operationId: "createTransfer",
  tags: ["Finance", "Transfer"],
  requiresAuth: true,
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            fromType: {
              type: "string",
              description: "The type of wallet to transfer from",
            },
            toType: {
              type: "string",
              description: "The type of wallet to transfer to",
            },
            fromCurrency: {
              type: "string",
              description: "The currency to transfer from",
            },
            toCurrency: {
              type: "string",
              description: "The currency to transfer to",
              nullable: true,
            },
            amount: { type: "number", description: "Amount to transfer" },
            transferType: {
              type: "string",
              description: "Type of transfer: client or wallet",
            },
            clientId: {
              type: "string",
              description: "Client UUID for client transfers",
              nullable: true,
            },
          },
          required: [
            "fromType",
            "toType",
            "amount",
            "fromCurrency",
            "transferType",
          ],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Transfer transaction initiated successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: { type: "string", description: "Success message" },
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Withdraw Method"),
    500: serverErrorResponse,
  },
};

export default async (data: Handler) => {
  const { user, body } = data;
  if (!user?.id)
    throw createError({ statusCode: 401, message: "Unauthorized" });

  const {
    fromType,
    toType,
    amount,
    transferType,
    clientId,
    fromCurrency,
    toCurrency,
  } = body;

  if (toCurrency === "Select a currency") {
    throw createError({
      statusCode: 400,
      message: "Please select a target currency",
    });
  }

  const userPk = await models.user.findByPk(user.id);
  if (!userPk)
    throw createError({ statusCode: 404, message: "User not found" });

  const fromWallet = await models.wallet.findOne({
    where: {
      userId: user.id,
      currency: fromCurrency,
      type: fromType,
    },
  });
  if (!fromWallet)
    throw createError({ statusCode: 404, message: "Wallet not found" });

  let toWallet: any = null;
  let toUser: any = null;

  if (transferType === "client") {
    ({ toWallet, toUser } = await handleClientTransfer(
      clientId,
      fromCurrency,
      fromType
    ));
  } else {
    toWallet = await handleWalletTransfer(
      user.id,
      fromType,
      toType,
      toCurrency
    );
  }

  const parsedAmount = parseFloat(amount);
  if (fromWallet.balance < parsedAmount)
    throw createError(400, "Insufficient balance");

  const currencyData = await getCurrencyData(fromType, fromCurrency);
  if (!currencyData) throw createError(400, "Invalid wallet type");

  const transaction = await performTransaction(
    transferType,
    fromWallet,
    toWallet,
    parsedAmount,
    fromCurrency,
    toCurrency,
    user.id,
    toUser?.id,
    fromType,
    toType,
    currencyData
  );

  if (transferType === "client") {
    const userPk = await models.user.findByPk(user.id);
    try {
      await sendTransferEmails(
        userPk,
        toUser,
        fromWallet,
        toWallet,
        parsedAmount,
        transaction
      );
    } catch (error) {
      console.error("Failed to send transfer emails:", error);
    }
  }

  return {
    message: "Transfer initiated successfully",
    fromTransfer: transaction.fromTransfer,
    toTransfer: transaction.toTransfer,
    fromType,
    toType,
    fromCurrency: fromCurrency,
    toCurrency: toCurrency,
  };
};

async function handleClientTransfer(
  clientId: string,
  currency: string,
  fromType: "FIAT" | "SPOT" | "ECO" | "FUTURES"
) {
  if (!clientId)
    throw createError({ statusCode: 400, message: "Client ID is required" });

  const toUser = await models.user.findByPk(clientId);
  if (!toUser)
    throw createError({ statusCode: 404, message: "Target user not found" });

  let toWallet;
  if (fromType === "ECO") {
    toWallet = await getWalletByUserIdAndCurrency(clientId, currency);
  } else {
    toWallet = await models.wallet.findOne({
      where: { userId: clientId, currency, type: fromType },
    });

    if (!toWallet) {
      toWallet = await models.wallet.create({
        userId: clientId,
        currency,
        type: fromType,
        status: true,
      });
    }
  }

  if (!toWallet)
    throw createError({ statusCode: 404, message: "Target wallet not found" });

  return { toWallet, toUser };
}

async function handleWalletTransfer(
  userId: string,
  fromType: "FIAT" | "SPOT" | "ECO" | "FUTURES",
  toType: "FIAT" | "SPOT" | "ECO" | "FUTURES",
  toCurrency: string
) {
  if (fromType === toType)
    throw createError(400, "Cannot transfer to the same wallet type");

  const validTransfers = {
    FIAT: ["SPOT", "ECO"],
    SPOT: ["FIAT", "ECO"],
    ECO: ["FIAT", "SPOT", "FUTURES"],
    FUTURES: ["ECO"],
  };

  if (!validTransfers[fromType] || !validTransfers[fromType].includes(toType))
    throw createError(400, "Invalid wallet type transfer");

  let toWallet = await models.wallet.findOne({
    where: { userId, currency: toCurrency, type: toType },
  });
  if (!toWallet) {
    toWallet = await models.wallet.create({
      userId,
      currency: toCurrency,
      type: toType,
      status: true,
    });
  }

  return toWallet;
}

async function performTransaction(
  transferType,
  fromWallet,
  toWallet,
  parsedAmount,
  fromCurrency,
  toCurrency,
  userId,
  clientId,
  fromType,
  toType,
  currencyData
) {
  const cacheManager = CacheManager.getInstance();
  const settings = await cacheManager.getSettings();
  const walletTransferFeePercentage =
    settings.get("walletTransferFeePercentage") || 0;

  const transferFeeAmount = calculateTransferFee(
    parsedAmount,
    walletTransferFeePercentage
  );
  const totalDeducted = parsedAmount;
  const targetReceiveAmount = parsedAmount - transferFeeAmount;

  if (fromWallet.balance < totalDeducted) {
    throw createError(400, "Insufficient balance to cover transfer and fees.");
  }

  return await sequelize.transaction(async (t) => {
    const requiresLedgerUpdate = requiresPrivateLedgerUpdate(
      transferType,
      fromType,
      toType
    );

    // Normalize transferType
    const normalizedTransferType = (transferType || "").trim().toLowerCase();

    // Determine if we should force COMPLETED for certain conditions
    let forceCompleted = false;

    // If transfer is client-to-client, always completed
    if (normalizedTransferType === "client") {
      forceCompleted = true;
    }

    // If from ECO to FUTURES or FUTURES to ECO, also force completed
    if (
      (fromType === "ECO" && toType === "FUTURES") ||
      (fromType === "FUTURES" && toType === "ECO")
    ) {
      forceCompleted = true;
    }

    const transferStatus = forceCompleted
      ? "COMPLETED"
      : requiresLedgerUpdate
        ? "PENDING"
        : "COMPLETED";

    if (transferStatus === "COMPLETED") {
      await handleCompleteTransfer({
        fromWallet,
        toWallet,
        parsedAmount,
        targetReceiveAmount,
        transferType: normalizedTransferType,
        fromType,
        fromCurrency,
        currencyData,
        t,
      });
    } else {
      await handlePendingTransfer({
        fromWallet,
        toWallet,
        totalDeducted,
        targetReceiveAmount,
        transferStatus,
        currencyData,
        t,
      });
    }

    const fromTransfer = await createTransferTransaction(
      userId,
      fromWallet.id,
      "OUTGOING_TRANSFER",
      parsedAmount,
      transferFeeAmount,
      fromCurrency,
      toCurrency,
      fromWallet.id,
      toWallet.id,
      `Transfer to ${toType} wallet`,
      transferStatus,
      t
    );

    const toTransfer = await createTransferTransaction(
      normalizedTransferType === "client" ? clientId! : userId,
      toWallet.id,
      "INCOMING_TRANSFER",
      targetReceiveAmount,
      0,
      fromCurrency,
      toCurrency,
      fromWallet.id,
      toWallet.id,
      `Transfer from ${fromType} wallet`,
      transferStatus,
      t
    );

    if (transferFeeAmount > 0) {
      await recordAdminProfit({
        userId,
        transferFeeAmount,
        fromCurrency,
        fromType,
        toType,
        transactionId: fromTransfer.id,
        t,
      });
    }

    return { fromTransfer, toTransfer };
  });
}

async function handleCompleteTransfer({
  fromWallet,
  toWallet,
  parsedAmount,
  targetReceiveAmount,
  transferType,
  fromType,
  fromCurrency,
  currencyData,
  t,
}: any) {
  if (fromType === "ECO" && transferType === "client") {
    await handleEcoClientBalanceTransfer({
      fromWallet,
      toWallet,
      parsedAmount,
      fromCurrency,
      currencyData,
      t,
    });
  } else {
    await handleNonClientTransfer({
      fromWallet,
      toWallet,
      parsedAmount,
      fromCurrency,
      targetReceiveAmount,
      currencyData,
      t,
    });
  }
}

async function handleEcoClientBalanceTransfer({
  fromWallet,
  toWallet,
  parsedAmount,
  fromCurrency,
  currencyData,
  t,
}: any) {
  const fromAddresses = parseAddresses(fromWallet.address);
  const toAddresses = parseAddresses(toWallet.address);

  let remainingAmount = parsedAmount;
  for (const [chain, chainInfo] of getSortedChainBalances(fromAddresses)) {
    if (remainingAmount <= 0) break;

    const transferableAmount = Math.min(
      (chainInfo as { balance: number }).balance,
      remainingAmount
    );

    (chainInfo as { balance: number }).balance -= transferableAmount;
    toAddresses[chain] = toAddresses[chain] || { balance: 0 };
    toAddresses[chain].balance += transferableAmount;

    await updatePrivateLedger(
      fromWallet.id,
      0,
      fromCurrency,
      chain,
      -transferableAmount,
      t
    );
    await updatePrivateLedger(
      toWallet.id,
      0,
      fromCurrency,
      chain,
      transferableAmount,
      t
    );

    remainingAmount -= transferableAmount;
  }

  if (remainingAmount > 0) {
    throw createError(400, "Insufficient chain balance across all addresses.");
  }

  await updateWalletBalances(
    fromWallet,
    toWallet,
    parsedAmount,
    parsedAmount,
    currencyData.precision,
    t
  );
}

async function handleNonClientTransfer({
  fromWallet,
  toWallet,
  parsedAmount,
  fromCurrency,
  targetReceiveAmount,
  currencyData,
  t,
}: any) {
  // ECO -> ECO: Deduct and add between two ECO wallets
  if (fromWallet.type === "ECO" && toWallet.type === "ECO") {
    const deductionDetails = await deductFromEcoWallet(
      fromWallet,
      parsedAmount,
      fromCurrency,
      t
    );
    await addToEcoWallet(toWallet, deductionDetails, fromCurrency, t);
  }

  // ECO -> FUTURES: Deduct from ECO ledger only
  else if (fromWallet.type === "ECO" && toWallet.type === "FUTURES") {
    await deductFromEcoWallet(fromWallet, parsedAmount, fromCurrency, t);
    // No addition to FUTURES ledger since FUTURES doesn't have a chain ledger
  }

  // FUTURES -> ECO: Add the entire received amount to ECO ledger
  else if (fromWallet.type === "FUTURES" && toWallet.type === "ECO") {
    // Since we have no chain details from FUTURES, we fabricate a chain entry
    const additionDetails = [{ chain: "main", amount: targetReceiveAmount }];
    await addToEcoWallet(toWallet, additionDetails, fromCurrency, t);
  }

  // For all other types (FIAT <-> SPOT, etc.) no special ledger handling needed
  // They simply rely on standard logic, if any.

  // Update wallet balances after handling ledger updates if needed
  await updateWalletBalances(
    fromWallet,
    toWallet,
    parsedAmount,
    targetReceiveAmount,
    currencyData.precision,
    t
  );
}

async function deductFromEcoWallet(
  wallet: any,
  amount: number,
  currency: string,
  t: any
) {
  const addresses = parseAddresses(wallet.address);
  let remainingAmount = amount;
  const deductionDetails: Record<string, any>[] = [];

  for (const chain in addresses) {
    if (addresses.hasOwnProperty(chain) && addresses[chain].balance > 0) {
      const transferableAmount = Math.min(
        addresses[chain].balance,
        remainingAmount
      );

      addresses[chain].balance -= transferableAmount;

      deductionDetails.push({ chain, amount: transferableAmount });

      await updatePrivateLedger(
        wallet.id,
        0,
        currency,
        chain,
        -transferableAmount
      );

      remainingAmount -= transferableAmount;
      if (remainingAmount <= 0) break;
    }
  }

  if (remainingAmount > 0)
    throw createError(
      400,
      "Insufficient chain balance to complete the transfer"
    );

  await wallet.update(
    {
      address: JSON.stringify(addresses),
    },
    { transaction: t }
  );

  return deductionDetails;
}

async function addToEcoWallet(
  wallet: any,
  deductionDetails: any[],
  currency: string,
  t: any
) {
  const addresses = parseAddresses(wallet.address);

  for (const detail of deductionDetails) {
    const { chain, amount } = detail;

    if (!addresses[chain]) {
      addresses[chain] = {
        address: null,
        network: null,
        balance: 0,
      };
    }

    addresses[chain].balance += amount;

    await updatePrivateLedger(wallet.id, 0, currency, chain, amount);
  }

  await wallet.update(
    {
      address: JSON.stringify(addresses),
    },
    { transaction: t }
  );
}

async function handlePendingTransfer({
  fromWallet,
  toWallet,
  totalDeducted,
  targetReceiveAmount,
  transferStatus,
  currencyData,
  t,
}: any) {
  const newFromBalance = calculateNewBalance(
    fromWallet.balance,
    -totalDeducted,
    currencyData
  );
  await fromWallet.update({ balance: newFromBalance }, { transaction: t });

  if (transferStatus === "COMPLETED") {
    const newToBalance = calculateNewBalance(
      toWallet.balance,
      targetReceiveAmount,
      currencyData
    );
    await toWallet.update({ balance: newToBalance }, { transaction: t });
  }
}

export function parseAddresses(address: any): { [key: string]: any } {
  if (!address) {
    return {};
  }

  if (typeof address === "string") {
    try {
      return JSON.parse(address);
    } catch (error) {
      console.error("Failed to parse address JSON:", error);
      return {};
    }
  }

  if (typeof address === "object") {
    return address;
  }

  return {};
}

export async function processInternalTransfer(
  fromUserId: string,
  toUserId: string,
  currency: string,
  chain: string,
  amount: number
) {
  const fromWallet = await models.wallet.findOne({
    where: {
      userId: fromUserId,
      currency: currency,
      type: "ECO",
    },
  });

  if (!fromWallet) {
    throw createError({ statusCode: 404, message: "Sender wallet not found" });
  }

  let toWallet = await models.wallet.findOne({
    where: {
      userId: toUserId,
      currency: currency,
      type: "ECO",
    },
  });

  if (!toWallet) {
    toWallet = await models.wallet.create({
      userId: toUserId,
      currency: currency,
      type: "ECO",
      status: true,
    });
  }

  const parsedAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (fromWallet.balance < parsedAmount) {
    throw createError(400, "Insufficient balance.");
  }

  const cacheManager = CacheManager.getInstance();
  const settings = await cacheManager.getSettings();
  const walletTransferFeePercentage =
    settings.get("walletTransferFeePercentage") || 0;

  const transferFeeAmount = (parsedAmount * walletTransferFeePercentage) / 100;
  const targetReceiveAmount = parsedAmount - transferFeeAmount;

  const transaction = await sequelize.transaction(async (t) => {
    let precision = 8;
    if (fromWallet.type === "ECO" && toWallet.type === "ECO") {
      const deductionDetails = await deductFromEcoWallet(
        fromWallet,
        parsedAmount,
        currency,
        t
      );

      await addToEcoWallet(toWallet, deductionDetails, currency, t);

      const currencyData = await getCurrencyData(
        fromWallet.type,
        fromWallet.currency
      );
      precision = currencyData.precision;
    }

    await updateWalletBalances(
      fromWallet,
      toWallet,
      parsedAmount,
      targetReceiveAmount,
      precision,
      t
    );

    const outgoingTransfer = await createTransferTransaction(
      fromUserId,
      fromWallet.id,
      "OUTGOING_TRANSFER",
      parsedAmount,
      transferFeeAmount,
      currency,
      currency,
      fromWallet.id,
      toWallet.id,
      `Internal transfer to user ${toUserId}`,
      "COMPLETED",
      t
    );

    const incomingTransfer = await createTransferTransaction(
      toUserId,
      toWallet.id,
      "INCOMING_TRANSFER",
      targetReceiveAmount,
      0,
      currency,
      currency,
      fromWallet.id,
      toWallet.id,
      `Internal transfer from user ${fromUserId}`,
      "COMPLETED",
      t
    );

    if (transferFeeAmount > 0) {
      await recordAdminProfit({
        userId: fromUserId,
        transferFeeAmount,
        fromCurrency: currency,
        fromType: "ECO",
        toType: "ECO",
        transactionId: outgoingTransfer.id,
        t,
      });
    }

    return { outgoingTransfer, incomingTransfer };
  });

  const userWallet = await models.wallet.findOne({
    where: { userId: fromUserId, currency, type: "ECO" },
  });

  return {
    transaction,
    balance: userWallet?.balance,
    method: chain,
    currency,
  };
}
