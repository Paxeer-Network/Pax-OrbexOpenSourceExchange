


interface icoAllocationAttributes {
  id: string;
  name: string;
  percentage: number;
  tokenId: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED" | "REJECTED";
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

type icoAllocationPk = "id";
type icoAllocationId = icoAllocation[icoAllocationPk];
type icoAllocationOptionalAttributes =
  | "id"
  | "status"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
type icoAllocationCreationAttributes = Optional<
  icoAllocationAttributes,
  icoAllocationOptionalAttributes
>;
