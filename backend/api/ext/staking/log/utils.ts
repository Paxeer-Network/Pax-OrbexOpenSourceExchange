import { emailQueue } from "@b/utils/emails";
import { baseNumberSchema, baseStringSchema } from "@b/utils/schema";

export async function sendStakingInitiationEmail(user, stake, pool, reward) {
  const stakeDate = new Date(stake.stake_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const releaseDate = new Date(stake.release_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const emailData = {
    TO: user.email,
    FIRSTNAME: user.firstName,
    TOKEN_NAME: pool.name,
    STAKE_AMOUNT: stake.amount.toString(),
    TOKEN_SYMBOL: pool.currency,
    STAKE_DATE: stakeDate,
    RELEASE_DATE: releaseDate,
    EXPECTED_REWARD: reward,
  };

  await emailQueue.add({
    emailData,
    emailType: "StakingInitiationConfirmation",
  });
}

export const baseStakeSchema = {
  id: baseStringSchema("Stake ID"),
  amount: baseNumberSchema("Staked amount"),
  interestRate: baseNumberSchema("Interest rate"),
  status: baseStringSchema("Stake status"),
  pool: {
    type: "object",
    properties: {
      name: baseStringSchema("Pool name"),
      currency: baseStringSchema("Currency"),
      chain: baseStringSchema("Blockchain"),
      type: baseStringSchema("Pool type"),
      durations: {
        type: "array",
        items: {
          type: "object",
          properties: {
            duration: baseNumberSchema("Duration in days"),
            interestRate: baseNumberSchema("Interest rate"),
          },
        },
        description: "Staking durations related to the pool",
      },
    },
  },
};

export const basePoolSchema = {
  name: baseStringSchema("Pool name"),
  currency: baseStringSchema("Currency"),
  chain: baseStringSchema("Blockchain"),
  type: baseStringSchema("Pool type"),
  durations: {
    type: "array",
    items: {
      type: "object",
      properties: {
        duration: baseNumberSchema("Duration in days"),
        interestRate: baseNumberSchema("Interest rate"),
      },
    },
    description: "Staking durations related to the pool",
  },
};
