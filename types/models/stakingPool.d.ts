


interface stakingPoolAttributes {
  id: string;
  name: string;
  description: string;
  currency: string;
  chain: string;
  type: "FIAT" | "SPOT" | "ECO";
  minStake: number;
  maxStake: number;
  status: "ACTIVE" | "INACTIVE" | "COMPLETED";
  icon?: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

type stakingPoolPk = "id";
type stakingPoolId = stakingPool[stakingPoolPk];
type stakingPoolOptionalAttributes =
  | "id"
  | "type"
  | "status"
  | "icon"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
type stakingPoolCreationAttributes = Optional<
  stakingPoolAttributes,
  stakingPoolOptionalAttributes
>;
