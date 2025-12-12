


interface p2pTradeAttributes {
  id: string;
  userId: string;
  sellerId: string;
  offerId: string;
  amount: number;
  status:
    | "PENDING"
    | "PAID"
    | "DISPUTE_OPEN"
    | "ESCROW_REVIEW"
    | "CANCELLED"
    | "COMPLETED"
    | "REFUNDED";
  messages?: ChatMessage[];
  txHash?: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

type p2pTradePk = "id";
type p2pTradeId = p2pTrade[p2pTradePk];
type p2pTradeOptionalAttributes =
  | "id"
  | "status"
  | "messages"
  | "txHash"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
type p2pTradeCreationAttributes = Optional<
  p2pTradeAttributes,
  p2pTradeOptionalAttributes
>;
