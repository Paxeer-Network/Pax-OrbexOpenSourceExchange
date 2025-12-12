


interface icoTokenAttributes {
  id: string;
  name: string;
  chain: string;
  currency: string;
  purchaseCurrency: string;
  purchaseWalletType: "FIAT" | "SPOT" | "ECO";
  address: string;
  totalSupply: number;
  description: string;
  image: string;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "REJECTED" | "CANCELLED";
  projectId: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

type icoTokenPk = "id";
type icoTokenId = icoToken[icoTokenPk];
type icoTokenOptionalAttributes =
  | "id"
  | "purchaseCurrency"
  | "purchaseWalletType"
  | "status"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
type icoTokenCreationAttributes = Optional<
  icoTokenAttributes,
  icoTokenOptionalAttributes
>;
