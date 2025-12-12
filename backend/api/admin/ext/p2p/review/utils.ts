import {
  baseStringSchema,
  baseNumberSchema,
  baseDateTimeSchema,
} from "@b/utils/schema";

const id = baseStringSchema("ID of the P2P Review");
const reviewerId = baseStringSchema("ID of the User who made the review");
const reviewedId = baseStringSchema("ID of the User who was reviewed");
const offerId = baseStringSchema(
  "ID of the P2P Offer associated with the review"
);
const rating = baseNumberSchema("Rating given in the review");
const comment = baseStringSchema(
  "Comment provided in the review",
  255,
  0,
  true
);
const createdAt = baseDateTimeSchema("Creation date of the review");
const updatedAt = baseDateTimeSchema("Last update date of the review");

export const p2pReviewSchema = {
  id,
  reviewerId,
  reviewedId,
  offerId,
  rating,
  comment,
  createdAt,
  updatedAt,
};

export const baseP2pReviewSchema = {
  id,
  reviewerId,
  reviewedId,
  offerId,
  rating,
  comment,
  createdAt,
  updatedAt,
  deletedAt: baseDateTimeSchema("Deletion date of the review, if any"),
};

export const p2pReviewUpdateSchema = {
  type: "object",
  properties: {
    rating,
    comment,
  },
  required: ["rating"],
};

export const p2pReviewStoreSchema = {
  description: `P2P Review created or updated successfully`,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: baseP2pReviewSchema,
      },
    },
  },
};
