import { storeRecord, storeRecordResponses } from "@b/utils/query";
import { FuturesMarketStoreSchema, FuturesMarketUpdateSchema } from "./utils";

export const metadata: OperationObject = {
  summary: "Stores a new Futures Market",
  operationId: "storeFuturesMarket",
  tags: ["Admin", "Futures Markets"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: FuturesMarketUpdateSchema,
      },
    },
  },
  responses: storeRecordResponses(FuturesMarketStoreSchema, "Futures Market"),
  requiresAuth: true,
  permission: "Access Futures Market Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { currency, pair, isTrending, isHot, metadata } = body;

  return await storeRecord({
    model: "futuresMarket",
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
