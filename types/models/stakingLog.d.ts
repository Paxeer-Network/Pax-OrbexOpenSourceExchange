


interface stakingLogAttributes {
  id: string;
  userId: string;
  poolId: string;
  durationId: string;
  amount: number;
  status: "ACTIVE" | "RELEASED" | "COLLECTED";
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

type stakingLogPk = "id";
type stakingLogId = stakingLog[stakingLogPk];
type stakingLogOptionalAttributes =
  | "id"
  | "status"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
type stakingLogCreationAttributes = Optional<
  stakingLogAttributes,
  stakingLogOptionalAttributes
>;
