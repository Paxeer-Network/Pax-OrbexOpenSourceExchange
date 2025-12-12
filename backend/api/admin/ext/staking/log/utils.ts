import {
  baseStringSchema,
  baseNumberSchema,
  baseDateTimeSchema,
  baseEnumSchema,
} from "@b/utils/schema";

const id = baseStringSchema("ID of the staking log");
const userId = baseStringSchema("User ID of the staker");
const poolId = baseStringSchema("ID of the staking pool");
const durationId = baseStringSchema("ID of the staking duration");
const amount = baseNumberSchema("Amount staked");
const status = baseEnumSchema("Current status of the staking log", [
  "ACTIVE",
  "RELEASED",
  "COLLECTED",
]);
const createdAt = baseDateTimeSchema("Creation date of the staking log");
const updatedAt = baseDateTimeSchema("Last update date of the staking log");

export const stakingLogSchema = {
  id,
  userId,
  poolId,
  durationId,
  amount,
  status,
  createdAt,
  updatedAt,
};

export const stakingLogUpdateSchema = {
  type: "object",
  properties: {
    userId,
    poolId,
    durationId,
    amount,
    status,
  },
  required: ["userId", "poolId", "durationId", "amount", "status"],
};

export const stakingLogStoreSchema = {
  description: `Staking log created or updated successfully`,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: stakingLogSchema,
      },
    },
  },
};
