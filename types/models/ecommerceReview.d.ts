


interface ecommerceReviewAttributes {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
  status: boolean;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

type ecommerceReviewPk = "id";
type ecommerceReviewId = ecommerceReview[ecommerceReviewPk];
type ecommerceReviewOptionalAttributes =
  | "id"
  | "comment"
  | "status"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
type ecommerceReviewCreationAttributes = Optional<
  ecommerceReviewAttributes,
  ecommerceReviewOptionalAttributes
>;
