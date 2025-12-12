


interface nftTransactionAttributes {
  id: string;
  nftAssetId: string;
  sellerId: string;
  buyerId: string;
  price: number;
  transactionHash: string;
  type: "PURCHASE" | "SALE";
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt?: Date;
  updatedAt?: Date;
}

type nftTransactionPk = "id";
type nftTransactionId = nftTransaction[nftTransactionPk];
type nftTransactionOptionalAttributes =
  | "id"
  | "status"
  | "createdAt"
  | "updatedAt";
type nftTransactionCreationAttributes = Optional<
  nftTransactionAttributes,
  nftTransactionOptionalAttributes
>;
