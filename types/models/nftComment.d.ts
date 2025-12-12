


interface nftCommentAttributes {
  id: string;
  collectionId: string; // Changed from nftAssetId to collectionId
  userId: string;
  comment: string;
  createdAt?: Date;
}

type nftCommentPk = "id";
type nftCommentId = nftComment[nftCommentPk];
type nftCommentOptionalAttributes = "id" | "createdAt";
type nftCommentCreationAttributes = Optional<
  nftCommentAttributes,
  nftCommentOptionalAttributes
>;
