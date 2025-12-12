


interface icoPhaseAttributes {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  price: number;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "REJECTED" | "CANCELLED";
  tokenId: string;
  minPurchase: number;
  maxPurchase: number;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

type icoPhasePk = "id";
type icoPhaseId = icoPhase[icoPhasePk];
type icoPhaseOptionalAttributes =
  | "id"
  | "status"
  | "minPurchase"
  | "maxPurchase"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
type icoPhaseCreationAttributes = Optional<
  icoPhaseAttributes,
  icoPhaseOptionalAttributes
>;
