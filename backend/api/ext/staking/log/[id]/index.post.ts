import { models, sequelize } from "@b/db";
import { createError } from "@b/utils/error";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Withdraws a user's staked tokens and rewards",
  description:
    "Allows a user to withdraw their staked tokens along with the earned rewards after the staking duration has ended.",
  operationId: "withdrawStake",
  tags: ["Staking", "Withdrawal"],
  requiresAuth: true,
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string", description: "Stake ID" },
    },
  ],
  responses: {
    200: {
      description: "Stake and rewards collected successfully",
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Stake"),
    500: serverErrorResponse,
  },
};

export default async (data: Handler) => {
  const { params, user } = data;
  if (!user?.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  const { id } = params;

  return await sequelize.transaction(async (t) => {
    const stake = (await models.stakingLog.findOne({
      where: { id, userId: user.id },
      include: [
        { model: models.stakingPool, as: "pool" },
        {
          model: models.stakingDuration,
          as: "duration",
        },
      ],
      transaction: t,
    })) as any;

    if (!stake) throw new Error("Stake not found");

    const startDate = new Date(stake.createdAt);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + stake.duration.duration);

    if (endDate > new Date()) throw new Error("Stake duration not over");

    if (stake.status === "COLLECTED")
      throw new Error("Stake already collected");

    const transactionRecord = await models.transaction.findOne({
      where: { referenceId: id },
      transaction: t,
    });

    if (!transactionRecord) {
      stake.destroy({ transaction: t });
      throw new Error("Transaction record not found");
    }

    const metadata = JSON.parse(transactionRecord.metadata);

    const wallet = await models.wallet.findOne({
      where: { id: transactionRecord.walletId },
      transaction: t,
    });
    if (!wallet) throw new Error("Wallet not found");

    const reward = parseFloat(metadata.reward || "0");
    const totalAmount = stake.amount + reward;

    const newBalance = wallet.balance + totalAmount;
    await wallet.update(
      {
        balance: newBalance,
      },
      {
        transaction: t,
      }
    );

    // Update the stake status
    await stake.update(
      {
        status: "COLLECTED",
      },
      {
        transaction: t,
      }
    );

    // Create a transaction record for this operation
    await models.transaction.create(
      {
        userId: user.id,
        walletId: wallet.id,
        type: "STAKING_REWARD",
        amount: totalAmount,
        description: `Collected ${stake.amount} ${stake.pool.currency} and reward ${reward} ${stake.pool.currency} from ${stake.pool.name} pool`,
        status: "COMPLETED",
        fee: 0,
        metadata: JSON.stringify({
          poolId: stake.poolId,
          durationId: metadata.durationId,
        }),
      },
      {
        transaction: t,
      }
    );

    return stake;
  });
};
