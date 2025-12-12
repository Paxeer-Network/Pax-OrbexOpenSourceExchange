// /api/p2p/disputes/store.post.ts

import { storeRecord, storeRecordResponses } from "@b/utils/query";
import { p2pDisputeStoreSchema, p2pDisputeUpdateSchema } from "./utils";

export const metadata = {
  summary: "Stores a new P2P Dispute",
  operationId: "storeP2PDispute",
  tags: ["Admin","P2P", "Disputes"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: p2pDisputeUpdateSchema,
      },
    },
  },
  responses: storeRecordResponses(p2pDisputeStoreSchema, "P2P Dispute"),
  requiresAuth: true,
  permission: "Access P2P Dispute Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { tradeId, raisedById, reason, status, resolution } = body;

  return await storeRecord({
    model: "p2pDispute",
    data: {
      tradeId,
      raisedById,
      reason,
      status,
      resolution,
    },
  });
};
