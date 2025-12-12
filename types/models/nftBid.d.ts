


interface nftBidAttributes {
  id: string;
  auctionId: string; // Reference to nftAuction
  bidderId: string;
  amount: number;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  nftAssetId?: string; // Add nftAssetId as optional
  createdAt?: Date;
  updatedAt?: Date;
}

type nftBidPk = "id";
type nftBidId = nftBid[nftBidPk];
type nftBidOptionalAttributes =
  | "id"
  | "status"
  | "nftAssetId"
  | "createdAt"
  | "updatedAt";
type nftBidCreationAttributes = Optional<
  nftBidAttributes,
  nftBidOptionalAttributes
>;
