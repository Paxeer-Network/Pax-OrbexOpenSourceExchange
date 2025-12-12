


// Updated nftCollection.ts with likes and views
interface nftCollectionAttributes {
  id: string;
  creatorId: string;
  name: string;
  description: string;
  chain: string;
  image: string;
  featured?: boolean;
  views: number;
  links?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // Include computed fields
  floorPrice?: number; // Computed field for floor price
  volume?: number; // Computed field for total volume
  nftCount?: number; // Computed field for number of NFTs
  holders?: number; // Computed field for number of holders
  totalVolume?: number; // Total transaction volume
  totalSales?: number; // Total sales count
}

type nftCollectionPk = "id";
type nftCollectionId = nftCollection[nftCollectionPk];
type nftCollectionOptionalAttributes =
  | "id"
  | "featured"
  | "views"
  | "links"
  | "createdAt"
  | "updatedAt"
  | "deletedAt";
type nftCollectionCreationAttributes = Optional<
  nftCollectionAttributes,
  nftCollectionOptionalAttributes
>;
