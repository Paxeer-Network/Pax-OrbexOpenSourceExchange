


interface walletDataAttributes {
  id: string;
  walletId: string;
  currency: string;
  chain: string;
  balance: number;
  index: number;
  data: string;
}

type walletDataPk = "id";
type walletDataId = walletData[walletDataPk];
type walletDataOptionalAttributes = "id" | "balance" | "index";
type walletDataCreationAttributes = Optional<
  walletDataAttributes,
  walletDataOptionalAttributes
>;
