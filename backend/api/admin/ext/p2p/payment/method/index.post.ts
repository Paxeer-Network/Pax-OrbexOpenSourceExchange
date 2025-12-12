// /api/p2p/paymentMethods/store.post.ts

import { storeRecord, storeRecordResponses } from "@b/utils/query";
import {
  p2pPaymentMethodStoreSchema,
  p2pPaymentMethodUpdateSchema,
} from "./utils";

export const metadata = {
  summary: "Stores a new P2P Payment Method",
  operationId: "storeP2PPaymentMethod",
  tags: ["Admin","P2P", "Payment Methods"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: p2pPaymentMethodUpdateSchema,
      },
    },
  },
  responses: storeRecordResponses(
    p2pPaymentMethodStoreSchema,
    "P2P Payment Method"
  ),
  requiresAuth: true,
  permission: "Access P2P Payment Method Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const {
    userId,
    name,
    instructions,
    walletType,
    chain,
    currency,
    image,
    status,
  } = body;

  return await storeRecord({
    model: "p2pPaymentMethod",
    data: {
      userId,
      name,
      instructions,
      walletType,
      chain,
      currency,
      image,
      status,
    },
  });
};
