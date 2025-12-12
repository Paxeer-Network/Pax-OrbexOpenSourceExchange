// /api/admin/ico/tokens/store.post.ts

import { storeRecord, storeRecordResponses } from "@b/utils/query";
import { icoTokenStoreSchema, icoTokenUpdateSchema } from "./utils";

export const metadata = {
  summary: "Stores a new ICO Token",
  operationId: "storeIcoToken",
  tags: ["Admin", "ICO Tokens"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: icoTokenUpdateSchema,
      },
    },
  },
  responses: storeRecordResponses(icoTokenStoreSchema, "ICO Token"),
  requiresAuth: true,
  permission: "Access ICO Token Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const {
    name,
    chain,
    currency,
    purchaseCurrency,
    purchaseWalletType,
    address,
    totalSupply,
    description,
    image,
    status,
    projectId,
  } = body;

  return await storeRecord({
    model: "icoToken",
    data: {
      name,
      chain: chain.toUpperCase(),
      currency: currency.toUpperCase(),
      purchaseCurrency: purchaseCurrency.toUpperCase(),
      purchaseWalletType,
      address,
      totalSupply,
      description,
      image,
      status,
      projectId,
    },
  });
};
