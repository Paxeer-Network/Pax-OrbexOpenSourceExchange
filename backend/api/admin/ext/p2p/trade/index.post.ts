// /api/p2p/trades/store.post.ts

import { storeRecord, storeRecordResponses } from "@b/utils/query";
import { p2pTradeStoreSchema, p2pTradeUpdateSchema } from "./utils";

export const metadata = {
  summary: "Stores a new P2P Trade",
  operationId: "storeP2PTrade",
  tags: ["Admin","P2P", "Trades"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: p2pTradeUpdateSchema,
      },
    },
  },
  responses: storeRecordResponses(p2pTradeStoreSchema, "P2P Trade"),
  requiresAuth: true,
  permission: "Access P2P Trade Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { userId, sellerId, offerId, amount, status, messages, txHash } = body;

  return await storeRecord({
    model: "p2pTrade",
    data: {
      userId,
      sellerId,
      offerId,
      amount,
      status,
      messages,
      txHash,
    },
  });
};
