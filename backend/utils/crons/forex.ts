// backend/utils/crons/forex.ts

import { models, sequelize } from "@b/db";
import { logError } from "../logger";
import { addDays, addHours, isPast } from "date-fns";
import { sendInvestmentEmail } from "../emails";
import { handleNotification } from "../notifications";
import { processRewards } from "../affiliate";

export async function processForexInvestments() {
  try {
    const activeInvestments = await getActiveForexInvestments();

    for (const investment of activeInvestments) {
      try {
        await processForexInvestment(investment);
      } catch (error) {
        logError(
          `processForexInvestments - Error processing Forex investment ${investment.id}`,
          error,
          __filename
        );
        // keep going with the next investment
      }
    }
  } catch (error) {
    logError("processForexInvestments", error, __filename);
    throw error;
  }
}

export async function getActiveForexInvestments() {
  try {
    return await models.forexInvestment.findAll({
      where: {
        status: "ACTIVE",
      },
      include: [
        {
          model: models.forexPlan,
          as: "plan",
          attributes: [
            "id",
            "name",
            "title",
            "description",
            "defaultProfit",
            "defaultResult",
            "currency",
            "walletType",
          ],
        },
        {
          model: models.forexDuration,
          as: "duration",
          attributes: ["id", "duration", "timeframe"],
        },
      ],
      order: [
        ["status", "ASC"],
        ["createdAt", "ASC"],
      ],
    });
  } catch (error) {
    logError("getActiveForexInvestments", error, __filename);
    throw error;
  }
}

export async function processForexInvestment(investment) {
  try {
    if (investment.status === "COMPLETED") {
      return null;
    }

    const user = await fetchUser(investment.userId);
    if (!user) return null;

    const roi = calculateRoi(investment);
    const investmentResult = determineInvestmentResult(investment);

    // Check if we are past the investment's endDate
    if (shouldProcessInvestment(investment)) {
      // Now use a callback-style transaction
      const updatedInvestment = await sequelize.transaction(
        async (transaction) => {
          const wallet = await fetchWallet(
            user.id,
            investment.plan.currency,
            investment.plan.walletType,
            transaction
          );
          if (!wallet) return null;

          // Principal + ROI on WIN, principal only on DRAW, no returns on LOSS
          const newBalance = calculateNewBalance(
            wallet.balance,
            investment.amount,
            roi,
            investmentResult
          );

          // Update the wallet
          await models.wallet.update(
            { balance: newBalance },
            { where: { id: wallet.id }, transaction }
          );

          // Mark the investment as completed
          await models.forexInvestment.update(
            {
              status: "COMPLETED",
              result: investmentResult,
              profit: roi,
            },
            {
              where: { id: investment.id },
              transaction,
            }
          );

          // Return the updated record (with plan/duration relationships)
          return await models.forexInvestment.findByPk(investment.id, {
            include: [
              { model: models.forexPlan, as: "plan" },
              { model: models.forexDuration, as: "duration" },
            ],
            transaction,
          });
        }
      );

      if (updatedInvestment) {
        // Post-process actions (emails, notifications, affiliate, etc.)
        await postProcessInvestment(user, investment, updatedInvestment);
      }
      return updatedInvestment;
    }

    return null;
  } catch (error) {
    logError(`processForexInvestment - General`, error, __filename);
    throw error;
  }
}

/** Utility functions remain the same: */
function calculateRoi(investment) {
  return investment.profit || investment.plan.defaultProfit;
}
function determineInvestmentResult(investment) {
  return investment.result || investment.plan.defaultResult;
}
function shouldProcessInvestment(investment) {
  const endDate = calculateEndDate(investment);
  return isPast(endDate);
}
function calculateEndDate(investment) {
  let endDate;
  const createdAt = new Date(investment.createdAt);
  switch (investment.duration.timeframe) {
    case "HOUR":
      endDate = addHours(createdAt, investment.duration.duration);
      break;
    case "DAY":
      endDate = addDays(createdAt, investment.duration.duration);
      break;
    case "WEEK":
      endDate = addDays(createdAt, investment.duration.duration * 7);
      break;
    case "MONTH":
      endDate = addDays(createdAt, investment.duration.duration * 30);
      break;
    default:
      endDate = addHours(createdAt, investment.duration.duration);
      break;
  }
  return endDate;
}

async function fetchUser(userId) {
  try {
    const user = await models.user.findByPk(userId);
    if (!user) {
      logError(`fetchUser`, new Error(`User not found: ${userId}`), __filename);
      return null;
    }
    return user;
  } catch (error) {
    logError(`fetchUser`, error, __filename);
    throw error;
  }
}

async function fetchWallet(userId, currency, walletType, transaction) {
  try {
    const wallet = await models.wallet.findOne({
      where: { userId, currency, type: walletType },
      transaction,
    });
    if (!wallet) {
      throw new Error("Wallet not found");
    }
    return wallet;
  } catch (error) {
    logError(`fetchWallet`, error, __filename);
    throw error;
  }
}

function calculateNewBalance(balance, amount, roi, result) {
  switch (result) {
    case "WIN":
      // principal + profit
      return balance + amount + roi;
    case "DRAW":
      // principal only
      return balance + amount;
    case "LOSS":
      // nothing returned
      return balance;
    default:
      throw new Error(`Unexpected result: ${result}`);
  }
}

async function postProcessInvestment(user, originalInvestment, updated) {
  try {
    await sendInvestmentEmail(
      user,
      updated.plan,
      updated.duration,
      updated,
      "ForexInvestmentCompleted"
    );
    await handleNotification({
      userId: user.id,
      title: "Forex Investment Completed",
      message: `Your Forex investment of ${updated.amount} ${updated.plan.currency} is now ${updated.result}.`,
      type: "ACTIVITY",
    });
    await processRewards(
      user.id,
      originalInvestment.amount,
      "FOREX_INVESTMENT",
      updated.plan.currency
    );
  } catch (error) {
    logError(`postProcessInvestment`, error, __filename);
  }
}
