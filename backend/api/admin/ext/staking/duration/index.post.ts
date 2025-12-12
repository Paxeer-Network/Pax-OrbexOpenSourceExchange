// /api/staking/durations/store.post.ts

import { storeRecord, storeRecordResponses } from "@b/utils/query";
import {
  stakingDurationStoreSchema,
  stakingDurationUpdateSchema,
} from "./utils";

export const metadata = {
  summary: "Stores a new Staking Duration",
  operationId: "storeStakingDuration",
  tags: ["Admin","Staking", "Durations"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: stakingDurationUpdateSchema,
      },
    },
  },
  responses: storeRecordResponses(
    stakingDurationStoreSchema,
    "Staking Duration"
  ),
  requiresAuth: true,
  permission: "Access Staking Duration Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { poolId, duration, interestRate } = body;

  return await storeRecord({
    model: "stakingDuration",
    data: {
      poolId,
      duration,
      interestRate,
    },
  });
};
