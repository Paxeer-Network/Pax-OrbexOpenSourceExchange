// models/nftAsset.ts




interface nftAssetAttributes {
  id: string;
  collectionId: string;
  ownerId: string;
  address?: string;
  index?: number;
  name: string;
  image: string;
  attributes?: string;
  likes: number;
  price?: number;
  royalty?: number;
  featured?: boolean;
  status: boolean;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

type nftAssetPk = "id";
type nftAssetId = nftAsset[nftAssetPk];
type nftAssetOptionalAttributes =
  | "id"
  | "address"
  | "index"
  | "attributes"
  | "price"
  | "royalty"
  | "featured"
  | "likes"
  | "status"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
type nftAssetCreationAttributes = Optional<
  nftAssetAttributes,
  nftAssetOptionalAttributes
>;
