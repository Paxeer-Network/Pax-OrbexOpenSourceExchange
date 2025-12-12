


interface p2pPaymentMethodAttributes {
  id: string;
  userId: string;
  name: string;
  instructions: string;
  currency: string;
  chain?: string;
  walletType: "FIAT" | "SPOT" | "ECO";
  image?: string;
  status: boolean;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

type p2pPaymentMethodPk = "id";
type p2pPaymentMethodId = p2pPaymentMethod[p2pPaymentMethodPk];
type p2pPaymentMethodOptionalAttributes =
  | "id"
  | "currency"
  | "image"
  | "status"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
type p2pPaymentMethodCreationAttributes = Optional<
  p2pPaymentMethodAttributes,
  p2pPaymentMethodOptionalAttributes
>;
