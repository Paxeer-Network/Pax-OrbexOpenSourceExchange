


interface p2pReviewAttributes {
  id: string;
  reviewerId: string;
  reviewedId: string;
  offerId: string;
  rating: number;
  comment?: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

type p2pReviewPk = "id";
type p2pReviewId = p2pReview[p2pReviewPk];
type p2pReviewOptionalAttributes =
  | "id"
  | "comment"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
type p2pReviewCreationAttributes = Optional<
  p2pReviewAttributes,
  p2pReviewOptionalAttributes
>;
