


interface nftFollowAttributes {
  id: string;
  collectionId: string; // New field for linking to the collection
  followerId: string;
  createdAt?: Date;
}

type nftFollowPk = "id";
type nftFollowId = nftFollow[nftFollowPk];
type nftFollowOptionalAttributes = "id" | "createdAt";
type nftFollowCreationAttributes = Optional<
  nftFollowAttributes,
  nftFollowOptionalAttributes
>;
