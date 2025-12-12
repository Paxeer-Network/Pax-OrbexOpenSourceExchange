// /api/p2p/reviews/store.post.ts

import { storeRecord, storeRecordResponses } from "@b/utils/query";
import { p2pReviewStoreSchema, p2pReviewUpdateSchema } from "./utils";

export const metadata = {
  summary: "Stores a new P2P Review",
  operationId: "storeP2PReview",
  tags: ["Admin","P2P", "Reviews"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: p2pReviewUpdateSchema,
      },
    },
  },
  responses: storeRecordResponses(p2pReviewStoreSchema, "P2P Review"),
  requiresAuth: true,
  permission: "Access P2P Review Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { reviewerId, reviewedId, offerId, rating, comment } = body;

  return await storeRecord({
    model: "p2pReview",
    data: {
      reviewerId,
      reviewedId,
      offerId,
      rating,
      comment,
    },
  });
};
