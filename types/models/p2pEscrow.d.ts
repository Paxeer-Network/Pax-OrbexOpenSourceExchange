


interface p2pEscrowAttributes {
  id: string;
  tradeId: string;
  amount: number;
  status: "PENDING" | "HELD" | "RELEASED" | "CANCELLED";
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

type p2pEscrowPk = "id";
type p2pEscrowId = p2pEscrow[p2pEscrowPk];
type p2pEscrowOptionalAttributes =
  | "id"
  | "status"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
type p2pEscrowCreationAttributes = Optional<
  p2pEscrowAttributes,
  p2pEscrowOptionalAttributes
>;
