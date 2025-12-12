


interface icoPhaseAllocationAttributes {
  id: string;
  allocationId: string;
  phaseId: string;
  percentage: number;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

type icoPhaseAllocationPk = "id";
type icoPhaseAllocationId = icoPhaseAllocation[icoPhaseAllocationPk];
type icoPhaseAllocationOptionalAttributes =
  | "id"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
type icoPhaseAllocationCreationAttributes = Optional<
  icoPhaseAllocationAttributes,
  icoPhaseAllocationOptionalAttributes
>;
