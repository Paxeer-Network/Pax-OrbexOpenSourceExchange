


interface ecosystemCustodialWalletAttributes {
  id: string;
  masterWalletId: string;
  address: string;
  chain: string;
  network: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

type ecosystemCustodialWalletPk = "id";
type ecosystemCustodialWalletId =
  ecosystemCustodialWallet[ecosystemCustodialWalletPk];
type ecosystemCustodialWalletOptionalAttributes =
  | "id"
  | "network"
  | "status"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
type ecosystemCustodialWalletCreationAttributes = Optional<
  ecosystemCustodialWalletAttributes,
  ecosystemCustodialWalletOptionalAttributes
>;
