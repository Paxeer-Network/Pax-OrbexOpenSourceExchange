// /api/staking/pools/store.post.ts

import { storeRecord, storeRecordResponses } from "@b/utils/query";
import { stakingPoolStoreSchema, stakingPoolUpdateSchema } from "./utils";

export const metadata = {
  summary: "Stores a new Staking Pool",
  operationId: "storeStakingPool",
  tags: ["Admin", "Staking", "Pools"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: stakingPoolUpdateSchema,
      },
    },
  },
  responses: storeRecordResponses(stakingPoolStoreSchema, "Staking Pool"),
  requiresAuth: true,
  permission: "Access Staking Pool Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const {
    name,
    description,
    currency,
    chain,
    type,
    minStake,
    maxStake,
    status,
    icon,
  } = body;

  return await storeRecord({
    model: "stakingPool",
    data: {
      name,
      description,
      currency: currency ? currency.toUpperCase() : undefined,
      chain: chain ? chain.toUpperCase() : undefined,
      type,
      minStake,
      maxStake,
      status,
      icon,
    },
  });
};
