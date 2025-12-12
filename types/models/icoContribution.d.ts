


interface icoContributionAttributes {
  id: string;
  userId: string;
  phaseId: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED" | "REJECTED";
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

type icoContributionPk = "id";
type icoContributionId = icoContribution[icoContributionPk];
type icoContributionOptionalAttributes =
  | "id"
  | "status"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
type icoContributionCreationAttributes = Optional<
  icoContributionAttributes,
  icoContributionOptionalAttributes
>;
