// /api/p2pReviews/structure.get.ts

import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for P2P Reviews",
  operationId: "getP2pReviewStructure",
  tags: ["Admin","P2P Reviews"],
  responses: {
    200: {
      description: "Form structure for managing P2P Reviews",
      content: structureSchema,
    },
  },
  permission: "Access P2P Review Management"
};

export const p2pReviewStructure = () => {
  const reviewerId = {
    type: "input",
    label: "Reviewer ID",
    name: "reviewerId",
    placeholder: "Enter the reviewer's user ID",
  };

  const reviewedId = {
    type: "input",
    label: "Reviewed ID",
    name: "reviewedId",
    placeholder: "Enter the reviewed user's ID",
  };

  const offerId = {
    type: "input",
    label: "Offer ID",
    name: "offerId",
    placeholder: "Enter the associated offer ID",
  };

  const rating = {
    type: "input",
    label: "Rating",
    name: "rating",
    placeholder: "Rate from 1 to 5",
    ts: "number",
  };

  const comment = {
    type: "textarea",
    label: "Comment",
    name: "comment",
    placeholder: "Write a review comment",
  };

  return {
    reviewerId,
    reviewedId,
    offerId,
    rating,
    comment,
  };
};

export default (): object => {
  const { reviewerId, reviewedId, offerId, rating, comment } =
    p2pReviewStructure();

  return {
    get: [reviewerId, reviewedId, offerId, rating, comment],
    set: [reviewerId, reviewedId, offerId, rating, comment],
  };
};
