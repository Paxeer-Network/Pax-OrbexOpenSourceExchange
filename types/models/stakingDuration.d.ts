


interface stakingDurationAttributes {
  id: string;
  poolId: string;
  duration: number;
  interestRate: number;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

type stakingDurationPk = "id";
type stakingDurationId = stakingDuration[stakingDurationPk];
type stakingDurationOptionalAttributes =
  | "id"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
type stakingDurationCreationAttributes = Optional<
  stakingDurationAttributes,
  stakingDurationOptionalAttributes
>;
