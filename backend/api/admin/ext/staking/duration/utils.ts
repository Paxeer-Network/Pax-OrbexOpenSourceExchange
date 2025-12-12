import {
  baseStringSchema,
  baseNumberSchema,
  baseDateTimeSchema,
} from "@b/utils/schema";

const id = baseStringSchema("ID of the staking duration");
const poolId = baseStringSchema("ID of the staking pool");
const duration = baseNumberSchema("Duration in days");
const interestRate = baseNumberSchema("Interest rate per annum");
const createdAt = baseDateTimeSchema("Creation date of the staking duration");
const updatedAt = baseDateTimeSchema(
  "Last update date of the staking duration"
);

export const stakingDurationSchema = {
  id,
  poolId,
  duration,
  interestRate,
  createdAt,
  updatedAt,
};

export const baseStakingDurationSchema = {
  id,
  poolId,
  duration,
  interestRate,
  createdAt,
  updatedAt,
  deletedAt: baseDateTimeSchema(
    "Deletion date of the staking duration, if applicable"
  ),
};

export const stakingDurationUpdateSchema = {
  type: "object",
  properties: {
    poolId,
    duration,
    interestRate,
  },
  required: ["poolId", "duration", "interestRate"],
};

export const stakingDurationStoreSchema = {
  description: `Staking duration created or updated successfully`,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: stakingDurationSchema,
      },
    },
  },
};
