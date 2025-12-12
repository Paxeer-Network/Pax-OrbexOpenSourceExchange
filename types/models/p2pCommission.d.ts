


interface p2pCommissionAttributes {
  id: string;
  tradeId: string;
  amount: number;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

type p2pCommissionPk = "id";
type p2pCommissionId = p2pCommission[p2pCommissionPk];
type p2pCommissionOptionalAttributes =
  | "id"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
type p2pCommissionCreationAttributes = Optional<
  p2pCommissionAttributes,
  p2pCommissionOptionalAttributes
>;
