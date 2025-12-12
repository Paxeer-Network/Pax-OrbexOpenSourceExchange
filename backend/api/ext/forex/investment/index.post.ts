import { models, sequelize } from "@b/db";
import { sendInvestmentEmail } from "@b/utils/emails";
import { createError } from "@b/utils/error";
import { handleNotification } from "@b/utils/notifications";

import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Creates a new Forex investment",
  description: "Allows a user to initiate a new Forex investment.",
  operationId: "createForexInvestment",
  tags: ["Forex", "Investments"],
  requiresAuth: true,
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            accountId: { type: "string", description: "Forex account ID" },
            planId: { type: "string", description: "Forex plan ID" },
            durationId: {
              type: "string",
              description: "Investment duration ID",
            },
            amount: { type: "number", description: "Amount to invest" },
          },
          required: ["accountId", "planId", "durationId", "amount"],
        },
      },
    },
  },
  responses: {
    201: {
      description: "Forex investment created successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "string", description: "Forex investment ID" },
              userId: { type: "string", description: "User ID" },
              accountId: { type: "string", description: "Forex account ID" },
              planId: { type: "string", description: "Forex plan ID" },
              durationId: {
                type: "string",
                description: "Investment duration ID",
              },
              amount: { type: "number", description: "Investment amount" },
              status: { type: "string", description: "Investment status" },
              returns: { type: "number", description: "Investment returns" },
              startDate: {
                type: "string",
                description: "Investment start date",
              },
              endDate: { type: "string", description: "Investment end date" },
            },
            required: [
              "id",
              "userId",
              "accountId",
              "planId",
              "durationId",
              "amount",
              "status",
              "returns",
              "startDate",
              "endDate",
            ],
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Forex Investment"),
    500: serverErrorResponse,
  },
};

export default async (data: Handler) => {
  const { user, body } = data;
  if (!user?.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const { accountId, planId, durationId, amount } = body;

  return sequelize.transaction(async (t) => {
    const userPk = await models.user.findByPk(user.id, { transaction: t });
    if (!userPk) throw new Error("User not found");

    const plan = await models.forexPlan.findByPk(planId, { transaction: t });
    if (!plan) throw new Error("Plan not found");
    if (
      (plan.minAmount && amount < plan.minAmount) ||
      (plan.maxAmount && amount > plan.maxAmount)
    ) {
      throw new Error("Amount is not within plan limits");
    }

    const account = await models.forexAccount.findOne({
      where: { accountId: accountId, userId: user.id, type: "LIVE" },
      transaction: t,
    });
    if (!account) throw new Error("Account not found");
    if (account.balance && account.balance < amount)
      throw new Error("Insufficient balance");

    const duration = await models.forexDuration.findByPk(durationId, {
      transaction: t,
    });
    if (!duration) throw new Error("Duration not found");

    const endDate = new Date(); // Initialize with current date and time
    switch (duration.timeframe) {
      case "HOUR":
        endDate.setHours(endDate.getHours() + duration.duration);
        break;
      case "DAY":
        endDate.setDate(endDate.getDate() + duration.duration);
        break;
      case "WEEK":
        endDate.setDate(endDate.getDate() + 7 * duration.duration); // 7 days in a week
        break;
      case "MONTH":
        endDate.setDate(endDate.getDate() + 30 * duration.duration); // 30 days in a month
        break;
      default:
        throw new Error("Invalid timeframe");
    }

    const investment = await models.forexInvestment.create(
      {
        userId: user.id,
        planId: planId,
        amount: amount,
        status: ForexLogStatus.ACTIVE,
        durationId: durationId,
        endDate: endDate,
      },
      { transaction: t }
    );

    await models.forexAccount.update(
      {
        balance: (account.balance ?? 0) - amount,
      },
      {
        where: { id: account.id },
        transaction: t,
      }
    );

    try {
      await sendInvestmentEmail(
        userPk,
        plan,
        duration,
        investment,
        "NewForexInvestmentCreated"
      );
      await handleNotification({
        userId: user.id,
        title: "New Forex Investment",
        message: `You have successfully created a new Forex investment`,
        type: "ACTIVITY",
      });
    } catch (error) {
      throw new Error(error);
    }

    return investment;
  });
};
