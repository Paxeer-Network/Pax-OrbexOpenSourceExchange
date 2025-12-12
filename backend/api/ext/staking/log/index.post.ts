import { models, sequelize } from "@b/db";
import { createError } from "@b/utils/error";
import { sendStakingInitiationEmail } from "./utils";
import { createRecordResponses } from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Stakes tokens into a specified staking pool",
  description:
    "Allows a user to stake tokens by specifying a pool, amount, and duration.",
  operationId: "stakeTokens",
  tags: ["Staking"],
  requiresAuth: true,
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            poolId: { type: "string", description: "ID of the staking pool" },
            durationId: {
              type: "string",
              description: "ID of the staking duration",
            },
            amount: {
              type: "number",
              description: "Amount of tokens to stake",
            },
          },
          required: ["poolId", "amount", "durationId"],
        },
      },
    },
  },
  responses: createRecordResponses("Stake"),
};

export default async (data: Handler) => {
  const { body, user } = data;
  if (!user?.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const { poolId, amount, durationId } = body;

  const userPk = await models.user.findByPk(user.id);
  if (!userPk) throw new Error("User not found");

  return await sequelize.transaction(async (transaction) => {
    const pool = await models.stakingPool.findByPk(poolId, { transaction });
    if (!pool) throw new Error("Staking pool not found");

    const wallet = await models.wallet.findOne({
      where: {
        userId: user.id,
        currency: pool.currency,
        type: pool.type,
      },
      transaction,
    });
    if (!wallet) throw new Error("Wallet not found");

    if (wallet.balance < amount) {
      throw new Error("Insufficient balance");
    }

    const duration = await models.stakingDuration.findByPk(durationId, {
      transaction,
    });
    if (!duration) throw new Error("Staking duration not found");

    const newBalance = wallet.balance - amount;
    await wallet.update({ balance: newBalance }, { transaction });

    const releaseDate = new Date();
    releaseDate.setDate(releaseDate.getDate() + duration.duration);

    const newStake = await models.stakingLog.create(
      {
        userId: user.id,
        poolId: poolId,
        durationId: durationId,
        amount,
        status: "ACTIVE",
      },
      { transaction }
    );

    const reward = (amount * duration.duration * duration.interestRate) / 100;
    await models.transaction.create(
      {
        userId: user.id,
        walletId: wallet.id,
        type: "STAKING",
        amount,
        description: `Staked ${amount} ${pool.currency} for ${duration.duration} days at ${duration.interestRate}% interest`,
        status: "COMPLETED",
        referenceId: newStake.id,
        metadata: JSON.stringify({
          poolId: poolId,
          durationId: durationId,
          reward: reward.toString(),
        }),
      },
      { transaction }
    );

    // Send email notification
    try {
      await sendStakingInitiationEmail(
        userPk,
        newStake,
        pool,
        reward.toString()
      );
    } catch (error) {
      console.error("Failed to send email notification", error);
    }
    return {
      message: "Tokens staked successfully",
    };
  });
};
