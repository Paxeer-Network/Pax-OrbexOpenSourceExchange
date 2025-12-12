import {
  baseStringSchema,
  baseNumberSchema,
  baseEnumSchema,
  baseDateTimeSchema,
} from "@b/utils/schema";

const id = baseStringSchema("ID of the staking pool");
const name = baseStringSchema("Name of the staking pool");
const description = baseStringSchema("Description of the staking pool");
const currency = baseStringSchema("Currency used in the staking pool");
const chain = baseStringSchema(
  "Blockchain chain associated with the staking pool",
  255,
  0,
  true
);
const type = baseEnumSchema("Type of wallet used for staking", [
  "FIAT",
  "SPOT",
  "ECO",
]);
const minStake = baseNumberSchema("Minimum stake amount");
const maxStake = baseNumberSchema("Maximum stake amount");
const status = baseEnumSchema("Status of the staking pool", [
  "ACTIVE",
  "INACTIVE",
  "COMPLETED",
]);
const icon = baseStringSchema("Icon URL of the staking pool", 1000, 0, true);
const createdAt = baseDateTimeSchema("Creation date of the staking pool");
const updatedAt = baseDateTimeSchema("Last update date of the staking pool");
const deletedAt = baseDateTimeSchema("Deletion date of the staking pool", true);

export const stakingPoolSchema = {
  id,
  name,
  description,
  currency,
  chain,
  type,
  minStake,
  maxStake,
  status,
  icon,
  createdAt,
  updatedAt,
};

export const baseStakingPoolSchema = {
  id,
  name,
  description,
  currency,
  chain,
  type,
  minStake,
  maxStake,
  status,
  icon,
  createdAt,
  updatedAt,
  deletedAt,
};

export const stakingPoolUpdateSchema = {
  type: "object",
  properties: {
    name,
    description,
    currency,
    chain,
    type,
    minStake,
    maxStake,
    status,
    icon,
  },
  required: [
    "name",
    "description",
    "currency",
    "type",
    "minStake",
    "maxStake",
    "status",
  ],
};

export const stakingPoolStoreSchema = {
  description: `Staking Pool created or updated successfully`,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: baseStakingPoolSchema,
      },
    },
  },
};
