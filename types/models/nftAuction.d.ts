



interface nftAuctionAttributes {
  id: string;
  nftAssetId: string;
  startTime: Date;
  endTime: Date;
  startingBid: number;
  reservePrice?: number;
  currentBidId?: string | null; // Ensure it's nullable
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
}

type nftAuctionPk = "id";
type nftAuctionId = nftAuction[nftAuctionPk];
type nftAuctionOptionalAttributes = "reservePrice" | "currentBidId";
type nftAuctionCreationAttributes = Optional<
  nftAuctionAttributes,
  nftAuctionOptionalAttributes
>;
