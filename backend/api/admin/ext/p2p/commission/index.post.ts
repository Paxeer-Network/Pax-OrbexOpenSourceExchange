// /api/p2p/commissions/store.post.ts

import { storeRecord, storeRecordResponses } from "@b/utils/query";
import { p2pCommissionStoreSchema, p2pCommissionUpdateSchema } from "./utils";

export const metadata = {
  summary: "Stores a new P2P Commission",
  operationId: "storeP2PCommission",
  tags: ["Admin","P2P", "Commissions"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: p2pCommissionUpdateSchema,
      },
    },
  },
  responses: storeRecordResponses(p2pCommissionStoreSchema, "P2P Commission"),
  requiresAuth: true,
  permission: "Access P2P Commission Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { tradeId, amount } = body;

  return await storeRecord({
    model: "p2pCommission",
    data: {
      tradeId,
      amount,
    },
  });
};
