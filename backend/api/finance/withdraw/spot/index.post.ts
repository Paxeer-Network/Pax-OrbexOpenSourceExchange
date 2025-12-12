import ExchangeManager from "@b/utils/exchange";
// /server/api/finance/withdraw/spot/index.post.ts

import { models, sequelize } from "@b/db";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { createError } from "@b/utils/error";
import { sendTransactionStatusUpdateEmail } from "@b/utils/emails";
import { handleNetworkMappingReverse } from "../../currency/[type]/[code]/[method]/index.get";
import { CacheManager } from "@b/utils/cache";

export const metadata: OperationObject = {
  summary: "Performs a withdraw transaction",
  description:
    "Initiates a withdraw transaction for the currently authenticated user",
  operationId: "createWithdraw",
  tags: ["Wallets"],
  requiresAuth: true,
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            currency: {
              type: "string",
              description: "Currency to withdraw",
            },
            chain: {
              type: "string",
              description: "Withdraw method ID",
            },
            amount: {
              type: "number",
              description: "Amount to withdraw",
            },
            toAddress: {
              type: "string",
              description: "Withdraw toAddress",
            },
          },
          required: ["currency", "chain", "amount", "toAddress"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Withdraw transaction initiated successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Success message",
              },
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Withdraw"),
    500: serverErrorResponse,
  },
};

export default async (data: Handler) => {
  const { user, body } = data;
  if (!user?.id)
    throw createError({ statusCode: 401, message: "Unauthorized" });

  const { currency, chain, amount, toAddress, memo } = body;

  // Validate required fields
  if (!amount || !toAddress || !currency) {
    throw createError({ statusCode: 400, message: "Invalid input" });
  }

  const userPk = await models.user.findByPk(user.id);
  if (!userPk)
    throw createError({ statusCode: 404, message: "User not found" });

  const wallet = await models.wallet.findOne({
    where: { userId: user.id, currency: currency, type: "SPOT" },
  });
  if (!wallet) {
    throw createError({ statusCode: 404, message: "Wallet not found" });
  }

  const currencyData = await models.exchangeCurrency.findOne({
    where: { currency: wallet.currency },
  });
  if (!currencyData) {
    throw createError({ statusCode: 404, message: "Currency not found" });
  }

  // Fetch exchange data
  const exchange = await ExchangeManager.startExchange();
  const provider = await ExchangeManager.getProvider();
  if (!exchange) throw createError(500, "Exchange not found");

  const isXt = provider === "xt";

  const currencies: Record<string, ExchangeCurrency> =
    await exchange.fetchCurrencies();

  const exchangeCurrency = Object.values(currencies).find((c) =>
    isXt ? c.code === currency : c.id === currency
  ) as ExchangeCurrency;
  if (!exchangeCurrency) throw createError(404, "Exchange currency not found");

  // Calculate the fixed fee based on the network
  let fixedFee = 0;
  if (exchangeCurrency.networks && exchangeCurrency.networks[chain]) {
    fixedFee =
      exchangeCurrency.networks[chain].fee ||
      exchangeCurrency.networks[chain].fees?.withdraw ||
      0;
  }

  const parsedAmount = Math.abs(parseFloat(amount));
  const percentageFee = currencyData.fee || 0;

  // Check the withdrawChainFee setting
  const cacheManager = CacheManager.getInstance();
  const settings = await cacheManager.getSettings();
  const withdrawChainFeeEnabled =
    settings.has("withdrawChainFee") &&
    settings.get("withdrawChainFee") === "true";

  // Check the spotWithdrawFee setting
  const spotWithdrawFee = parseFloat(settings.get("spotWithdrawFee") || "0");

  // Calculate the combined fee percentage: base percentageFee + additional spotWithdrawFee
  const combinedPercentageFee = percentageFee + spotWithdrawFee;

  // Calculate the total fee amount based on the combined percentage
  const combinedFeeAmount = parseFloat(
    Math.max((parsedAmount * combinedPercentageFee) / 100, 0).toFixed(2)
  );

  // Calculate the total amount to deduct from user's wallet
  const Total = withdrawChainFeeEnabled
    ? parsedAmount + combinedFeeAmount
    : parsedAmount + combinedFeeAmount + fixedFee;

  if (wallet.balance < Total) {
    throw createError({ statusCode: 400, message: "Insufficient funds" });
  }

  const newBalance = parseFloat(
    (wallet.balance - Total).toFixed(currencyData.precision || 6)
  );

  if (newBalance < 0) {
    throw createError({ statusCode: 400, message: "Insufficient funds" });
  }

  // Start initial transaction to deduct amount and create transaction record
  const result = await sequelize.transaction(async (t) => {
    wallet.balance = newBalance;
    await wallet.save({ transaction: t });

    const dbTransaction = await models.transaction.create(
      {
        userId: user.id,
        walletId: wallet.id,
        type: "WITHDRAW",
        amount: parsedAmount,
        fee: combinedFeeAmount, // Use combined percentage fee in transaction
        status: "PENDING",
        metadata: JSON.stringify({
          chain: chain,
          currency,
          toAddress,
          memo,
        }),
        description: `Withdrawal of ${parsedAmount} ${wallet.currency} to ${toAddress} via ${chain}`,
      },
      { transaction: t }
    );

    // **Admin Profit Recording:**
    const adminProfit = await models.adminProfit.create(
      {
        amount: combinedFeeAmount,
        currency: wallet.currency,
        type: "WITHDRAW",
        transactionId: dbTransaction.id,
        chain: chain,
        description: `Admin profit from user (${user.id}) withdrawal fee of ${combinedFeeAmount} ${wallet.currency} on ${chain}`,
      },
      { transaction: t }
    );

    return { dbTransaction, adminProfit };
  });

  // Check the withdrawApproval setting
  const withdrawApprovalEnabled =
    settings.has("withdrawApproval") &&
    settings.get("withdrawApproval") === "true";

  if (withdrawApprovalEnabled) {
    // Proceed to perform the withdrawal with the exchange
    let withdrawResponse;
    let withdrawStatus:
      | "PENDING"
      | "COMPLETED"
      | "FAILED"
      | "CANCELLED"
      | "EXPIRED"
      | "REJECTED"
      | "REFUNDED"
      | "FROZEN"
      | "PROCESSING"
      | "TIMEOUT"
      | undefined = "PENDING";

    // Calculate the total amount to withdraw from the user's wallet
    const providerWithdrawAmount = withdrawChainFeeEnabled
      ? parsedAmount
      : parsedAmount + fixedFee;

    try {
      switch (provider) {
        case "kucoin":
          try {
            // Transfer funds from 'main' to 'trade' account
            const transferResult = await exchange.transfer(
              currency,
              providerWithdrawAmount,
              "main",
              "trade"
            );

            if (transferResult && transferResult.id) {
              // Proceed to withdraw
              withdrawResponse = await exchange.withdraw(
                currency,
                providerWithdrawAmount,
                toAddress,
                memo,
                { network: chain }
              );

              if (withdrawResponse && withdrawResponse.id) {
                // Fetch withdrawal status
                const withdrawals = await exchange.fetchWithdrawals(currency);
                const withdrawData = withdrawals.find(
                  (w) => w.id === withdrawResponse.id
                );

                if (withdrawData) {
                  withdrawResponse.fee = withdrawChainFeeEnabled
                    ? withdrawData.fee?.cost || fixedFee
                    : 0; // Use fee if enabled, otherwise set to 0
                  withdrawStatus =
                    withdrawData.status === "ok"
                      ? "COMPLETED"
                      : withdrawData.status.toUpperCase();
                } else {
                  withdrawResponse.fee = withdrawChainFeeEnabled ? fixedFee : 0;
                  withdrawStatus = "COMPLETED"; // Assume completed
                }
              } else {
                throw new Error("Withdrawal response invalid");
              }
            } else {
              throw new Error("Transfer to trade account failed");
            }
          } catch (error) {
            throw new Error("KuCoin withdrawal failed: " + error.message);
          }
          break;
        case "binance":
        case "kraken":
        case "okx":
          try {
            withdrawResponse = await exchange.withdraw(
              currency,
              providerWithdrawAmount,
              toAddress,
              memo,
              { network: chain }
            );

            if (withdrawResponse && withdrawResponse.id) {
              // Fetch withdrawal status
              const withdrawals = await exchange.fetchWithdrawals(currency);
              const withdrawData = withdrawals.find(
                (w) => w.id === withdrawResponse.id
              );

              if (withdrawData) {
                withdrawResponse.fee = withdrawChainFeeEnabled
                  ? withdrawData.fee?.cost || fixedFee
                  : 0; // Use fee if enabled, otherwise set to 0
                withdrawStatus =
                  withdrawData.status === "ok"
                    ? "COMPLETED"
                    : withdrawData.status.toUpperCase();
              } else {
                withdrawResponse.fee = withdrawChainFeeEnabled ? fixedFee : 0;
                withdrawStatus = "COMPLETED"; // Assume completed
              }
            } else {
              throw new Error("Withdrawal response invalid");
            }
          } catch (error) {
            throw new Error("Withdrawal failed: " + error.message);
          }
          break;
        case "xt":
          try {
            // Perform the withdrawal
            withdrawResponse = await exchange.withdraw(
              currency,
              providerWithdrawAmount,
              toAddress,
              memo,
              { network: chain }
            );

            if (withdrawResponse && withdrawResponse.id) {
              // Fetch withdrawal status
              const withdrawals = await exchange.fetchWithdrawals(currency);
              const withdrawData = withdrawals.find(
                (w) => w.id === withdrawResponse.id
              );

              if (withdrawData) {
                withdrawResponse.fee = withdrawChainFeeEnabled
                  ? withdrawData.fee?.cost || fixedFee
                  : 0; // Use fee if enabled, otherwise set to 0
                // Map xt exchange statuses to internal statuses
                const statusMapping = {
                  SUCCESS: "COMPLETED",
                  SUBMIT: "PENDING",
                  REVIEW: "PENDING",
                  AUDITED: "PROCESSING",
                  AUDITED_AGAIN: "PROCESSING",
                  PENDING: "PENDING",
                  FAIL: "FAILED",
                  CANCEL: "CANCELLED",
                };
                withdrawStatus =
                  statusMapping[withdrawData.status] ||
                  withdrawData.status.toUpperCase();
              } else {
                withdrawResponse.fee = withdrawChainFeeEnabled ? fixedFee : 0;
                withdrawStatus = "COMPLETED"; // Assume completed
              }
            } else {
              throw new Error("Withdrawal response invalid");
            }
          } catch (error) {
            throw new Error("Withdrawal failed: " + error.message);
          }
          break;
        default:
          throw new Error("Exchange provider not supported");
      }

      if (
        !withdrawResponse ||
        !withdrawResponse.id ||
        withdrawStatus === "FAILED" ||
        withdrawStatus === "CANCELLED"
      ) {
        throw new Error("Withdrawal failed");
      }

      // Update transaction status and metadata
      await models.transaction.update(
        {
          status: withdrawStatus,
          referenceId: withdrawResponse.id,
          metadata: JSON.stringify({
            ...JSON.parse(result.dbTransaction.metadata),
            withdrawResponse,
          }),
        },
        { where: { id: result.dbTransaction.id } }
      );

      // Send confirmation email to the user
      const userRecord = await models.user.findOne({
        where: { id: user.id },
      });
      if (userRecord) {
        await sendTransactionStatusUpdateEmail(
          userRecord,
          result.dbTransaction,
          wallet,
          wallet.balance,
          null // You can include a custom message if needed
        );
      }

      return {
        message: "Withdrawal completed successfully",
        transaction: result.dbTransaction,
        currency: wallet.currency,
        method: chain,
        balance: wallet.balance,
      };
    } catch (error) {
      // Handle rollback and return error response
      await sequelize.transaction(async (t) => {
        await models.transaction.update(
          {
            status: "CANCELLED",
            metadata: JSON.stringify({
              ...JSON.parse(result.dbTransaction.metadata),
              error: error.message,
            }),
          },
          { where: { id: result.dbTransaction.id }, transaction: t }
        );

        wallet.balance += Total; // Refund the total amount deducted
        await wallet.save({ transaction: t });

        await models.adminProfit.destroy({
          where: { id: result.adminProfit.id },
          transaction: t,
        });
      });

      throw createError(500, "Withdrawal failed: " + error.message);
    }
  } else {
    // Withdrawal approval is required; keep the transaction in 'PENDING' status
    return {
      message: "Withdrawal request submitted and pending approval",
      transaction: result.dbTransaction,
      currency: wallet.currency,
      method: chain,
      balance: wallet.balance,
    };
  }
};
