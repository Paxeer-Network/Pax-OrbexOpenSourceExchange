import { models, sequelize } from "@b/db";
import { logError } from "../logger";
import { addDays, addHours, isPast } from "date-fns";
import { sendInvestmentEmail } from "../emails";
import { handleNotification } from "../notifications";
import { processRewards } from "../affiliate";

export async function processGeneralInvestments() {
  try {
    const activeInvestments = await getActiveGeneralInvestments();

    for (const investment of activeInvestments) {
      try {
        await processGeneralInvestment(investment);
      } catch (error) {
        logError(
          `processGeneralInvestments - Error processing General investment ${investment.id}`,
          error,
          __filename
        );
        continue;
      }
    }
  } catch (error) {
    logError("processGeneralInvestments", error, __filename);
    throw error;
  }
}

export async function getActiveGeneralInvestments() {
  try {
    return await models.investment.findAll({
      where: {
        status: "ACTIVE",
      },
      include: [
        {
          model: models.investmentPlan,
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
          model: models.investmentDuration,
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
    logError("getActiveGeneralInvestments", error, __filename);
    throw error;
  }
}

export async function processGeneralInvestment(investment) {
  const { id, duration, createdAt, amount, profit, result, plan, userId } =
    investment;

  // Skip if already completed
  if (investment.status === "COMPLETED") {
    return null;
  }

  try {
    const user = await models.user.findByPk(userId);
    if (!user) {
      logError(
        `processGeneralInvestment`,
        new Error("User not found"),
        __filename
      );
      return null;
    }

    const roi = profit || plan.defaultProfit;
    const investmentResult = result || plan.defaultResult;

    // Calculate end date
    let endDate;
    switch (duration.timeframe) {
      case "HOUR":
        endDate = addHours(new Date(createdAt), duration.duration);
        break;
      case "DAY":
        endDate = addDays(new Date(createdAt), duration.duration);
        break;
      case "WEEK":
        endDate = addDays(new Date(createdAt), duration.duration * 7);
        break;
      case "MONTH":
        endDate = addDays(new Date(createdAt), duration.duration * 30);
        break;
      default:
        endDate = addHours(new Date(createdAt), duration.duration);
        break;
    }

    // If it's past the end date, complete the investment
    if (isPast(endDate)) {
      let updatedInvestment;
      try {
        // Fetch the wallet
        const wallet = await models.wallet.findOne({
          where: {
            userId: userId,
            currency: plan.currency,
            type: plan.walletType,
          },
        });
        if (!wallet) throw new Error("Wallet not found");

        // FIX: Add principal + ROI on WIN, do nothing on LOSS, principal only on DRAW
        const newBalance = getNewBalance(
          wallet.balance,
          amount,
          roi,
          investmentResult
        );

        // Update wallet & investment in a transaction
        updatedInvestment = await sequelize.transaction(async (transaction) => {
          await models.wallet.update(
            { balance: newBalance },
            { where: { id: wallet.id }, transaction }
          );

          await models.investment.update(
            {
              status: "COMPLETED",
              result: investmentResult,
              profit: roi,
            },
            {
              where: { id },
              transaction,
            }
          );

          return await models.investment.findByPk(id, {
            include: [
              { model: models.investmentPlan, as: "plan" },
              { model: models.investmentDuration, as: "duration" },
            ],
            transaction,
          });
        });
      } catch (error) {
        logError(`processGeneralInvestment`, error, __filename);
        return null;
      }

      if (updatedInvestment) {
        // Send email, notify user, affiliate rewards
        try {
          await sendInvestmentEmail(
            user,
            plan,
            duration,
            updatedInvestment,
            "InvestmentCompleted"
          );

          await handleNotification({
            userId: user.id,
            title: "General Investment Completed",
            message: `Your General investment of ${amount} has been completed with a status of ${investmentResult}`,
            type: "ACTIVITY",
          });
        } catch (error) {
          logError(`processGeneralInvestment`, error, __filename);
        }

        // Rewards
        try {
          await processRewards(
            user.id,
            amount,
            "GENERAL_INVESTMENT",
            plan.currency
          );
        } catch (error) {
          logError(`processGeneralInvestment`, error, __filename);
        }
      }

      return updatedInvestment;
    }
  } catch (error) {
    logError(`processGeneralInvestment`, error, __filename);
    throw error;
  }

  return null;
}

// Helper function to fix principal + ROI logic
function getNewBalance(currentBalance, amount, roi, investmentResult) {
  switch (investmentResult) {
    case "WIN":
      // Return principal + profit
      return currentBalance + amount + roi;
    case "LOSS":
      // Already subtracted the principal at creation; do nothing
      return currentBalance;
    case "DRAW":
      // Return principal only
      return currentBalance + amount;
    default:
      return currentBalance;
  }
}
