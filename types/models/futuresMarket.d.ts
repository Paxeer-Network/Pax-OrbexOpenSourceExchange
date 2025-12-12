


interface futuresMarketAttributes {
  id: string;
  currency: string;
  pair: string;
  isTrending?: boolean;
  isHot?: boolean;
  metadata?: string;
  status: boolean;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

type futuresMarketPk = "id";
type futuresMarketId = futuresMarket[futuresMarketPk];
type futuresMarketOptionalAttributes =
  | "id"
  | "isTrending"
  | "isHot"
  | "metadata"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
type futuresMarketCreationAttributes = Optional<
  futuresMarketAttributes,
  futuresMarketOptionalAttributes
>;
