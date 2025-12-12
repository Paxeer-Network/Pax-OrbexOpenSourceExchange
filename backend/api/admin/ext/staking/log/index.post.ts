// /api/staking/logs/store.post.ts

import { storeRecord, storeRecordResponses } from "@b/utils/query";
import { stakingLogStoreSchema, stakingLogUpdateSchema } from "./utils";

export const metadata = {
  summary: "Stores a new Staking Log",
  operationId: "storeStakingLog",
  tags: ["Admin","Staking", "Logs"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: stakingLogUpdateSchema,
      },
    },
  },
  responses: storeRecordResponses(stakingLogStoreSchema, "Staking Log"),
  requiresAuth: true,
  permission: "Access Staking Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { userId, poolId, durationId, amount, status } = body;

  return await storeRecord({
    model: "stakingLog",
    data: {
      userId,
      poolId,
      durationId,
      amount,
      status,
    },
  });
};
