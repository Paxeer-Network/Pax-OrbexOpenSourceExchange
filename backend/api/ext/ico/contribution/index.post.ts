import { models, sequelize } from "@b/db";
import { processRewards } from "@b/utils/affiliate";
import { sendIcoContributionEmail } from "@b/utils/emails";
import { createError } from "@b/utils/error";
import { handleNotification } from "@b/utils/notifications";

import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Creates a new ICO contribution",
  description: "Allows a user to contribute to an ICO phase.",
  operationId: "createIcoContribution",
  tags: ["ICO", "Contributions"],
  requiresAuth: true,
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            phaseId: {
              type: "string",
              description: "Phase ID for contribution",
            },
            amount: { type: "number", description: "Amount to contribute" },
          },
          required: ["phaseId", "amount"],
        },
      },
    },
  },
  responses: {
    201: {
      description: "Contribution created successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "string", description: "Contribution ID" },
              amount: { type: "number", description: "Amount contributed" },
              status: { type: "string", description: "Contribution status" },
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Ico Contribution"),
    500: serverErrorResponse,
  },
};

export default async (data: Handler) => {
  const { user, body } = data;
  if (!user?.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const { phaseId, amount } = body;
  if (amount <= 0) {
    throw createError({
      statusCode: 400,
      message: "Amount must be positive",
    });
  }

  const userPk = await models.user.findByPk(user.id);
  if (!userPk) {
    throw createError({ statusCode: 404, message: "User not found" });
  }

  let contribution, phase, wallet;
  await sequelize.transaction(async (t) => {
    phase = (await models.icoPhase.findByPk(phaseId, {
      include: [{ model: models.icoToken, as: "token" }],
      transaction: t,
    })) as any;

    if (!phase) {
      throw createError({ statusCode: 404, message: "Phase not found" });
    }

    wallet = await models.wallet.findOne({
      where: {
        userId: user.id,
        currency: phase.token.purchaseCurrency,
        type: phase.token.purchaseWalletType,
      },
      transaction: t,
    });

    if (!wallet || wallet.balance < amount) {
      throw createError({
        statusCode: 400,
        message: "Insufficient wallet balance",
      });
    }

    // Deduct amount from wallet
    wallet.balance -= amount;
    await wallet.save({ transaction: t });

    // Create contribution
    contribution = await models.icoContribution.create(
      {
        userId: user.id,
        phaseId: phase.id,
        amount,
      },
      { transaction: t }
    );

    // Create transaction record
    await models.transaction.create(
      {
        userId: user.id,
        walletId: wallet.id,
        type: "ICO_CONTRIBUTION",
        status: "COMPLETED",
        amount: amount,
        description: `Contribution in ${phase.token.currency} Offering ${phase.name} phase`,
        referenceId: contribution.id,
      },
      { transaction: t }
    );

    return contribution;
  });

  if (!contribution || !phase || !wallet) {
    throw createError({
      statusCode: 500,
      message: "Failed to create contribution",
    });
  }

  try {
    await handleNotification({
      userId: user.id,
      title: "ICO Contribution",
      message: `You have successfully contributed ${amount} ${phase.token.currency} to the ${phase.name} phase of the ${phase.token.currency} ICO`,
      type: "ACTIVITY",
    });
  } catch (error) {
    console.error(`Failed to send notification: ${error.message}`);
  }

  try {
    await sendIcoContributionEmail(
      userPk,
      contribution,
      phase.token,
      phase,
      "IcoNewContribution"
    );
  } catch (error) {
    console.error(`Failed to send email: ${error.message}`);
  }

  try {
    await processRewards(
      user.id,
      amount,
      "ICO_CONTRIBUTION",
      phase.token.purchaseCurrency
    );
  } catch (error) {
    console.error(`Failed to process rewards: ${error.message}`);
  }

  return { message: "Congrats! Your contribution was successful" };
};
