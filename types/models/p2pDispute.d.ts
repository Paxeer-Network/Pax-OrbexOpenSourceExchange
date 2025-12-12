


interface p2pDisputeAttributes {
  id: string;
  tradeId: string;
  raisedById: string;
  reason: string;
  status: "PENDING" | "OPEN" | "RESOLVED" | "CANCELLED";
  resolution?: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

type p2pDisputePk = "id";
type p2pDisputeId = p2pDispute[p2pDisputePk];
type p2pDisputeOptionalAttributes =
  | "id"
  | "status"
  | "resolution"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
type p2pDisputeCreationAttributes = Optional<
  p2pDisputeAttributes,
  p2pDisputeOptionalAttributes
>;
