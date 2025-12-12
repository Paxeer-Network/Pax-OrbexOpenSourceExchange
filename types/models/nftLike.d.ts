


interface nftLikeAttributes {
  id: string;
  nftAssetId: string; // Updated from collectionId to nftAssetId
  userId: string;
  createdAt?: Date;
}

type nftLikePk = "id";
type nftLikeId = nftLike[nftLikePk];
type nftLikeOptionalAttributes = "id" | "createdAt";
type nftLikeCreationAttributes = Optional<
  nftLikeAttributes,
  nftLikeOptionalAttributes
>;
