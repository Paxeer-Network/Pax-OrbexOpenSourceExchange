// /api/admin/ecosystem/markets/store.post.ts

import { storeRecord, storeRecordResponses } from "@b/utils/query";
import {
  MarketStoreSchema,
  MarketUpdateSchema,
} from "@b/api/admin/finance/exchange/market/utils";

export const metadata: OperationObject = {
  summary: "Stores a new Ecosystem Market",
  operationId: "storeEcosystemMarket",
  tags: ["Admin", "Ecosystem Markets"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: MarketUpdateSchema,
      },
    },
  },
  responses: storeRecordResponses(MarketStoreSchema, "Ecosystem Market"),
  requiresAuth: true,
  permission: "Access Ecosystem Market Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { currency, pair, isTrending, isHot, metadata } = body;

  return await storeRecord({
    model: "ecosystemMarket",
    data: {
      currency,
      pair,
      isTrending,
      isHot,
      metadata,
      status: true,
    },
  });
};
