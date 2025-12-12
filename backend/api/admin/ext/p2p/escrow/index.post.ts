// /api/p2p/escrows/store.post.ts

import { storeRecord, storeRecordResponses } from "@b/utils/query";
import { p2pEscrowStoreSchema, p2pEscrowUpdateSchema } from "./utils";

export const metadata = {
  summary: "Stores a new P2P Escrow record",
  operationId: "storeP2PEscrow",
  tags: ["Admin","P2P", "Escrows"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: p2pEscrowUpdateSchema,
      },
    },
  },
  responses: storeRecordResponses(p2pEscrowStoreSchema, "P2P Escrow"),
  requiresAuth: true,
  permission: "Access P2P Escrow Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { tradeId, amount, status } = body;

  return await storeRecord({
    model: "p2pEscrow",
    data: {
      tradeId,
      amount,
      status,
    },
  });
};
