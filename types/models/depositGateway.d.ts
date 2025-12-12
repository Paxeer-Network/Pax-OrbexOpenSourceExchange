


interface depositGatewayAttributes {
  id: string;
  name: string;
  title: string;
  description: string;
  image?: string;
  alias?: string;
  currencies?: string[];
  fixedFee?: number;
  percentageFee?: number;
  minAmount?: number;
  maxAmount?: number;
  type: "FIAT" | "CRYPTO";
  status?: boolean;
  version?: string;
  productId?: string;
}

type depositGatewayPk = "id";
type depositGatewayId = depositGateway[depositGatewayPk];
type depositGatewayOptionalAttributes =
  | "id"
  | "image"
  | "alias"
  | "currencies"
  | "fixedFee"
  | "percentageFee"
  | "minAmount"
  | "maxAmount"
  | "type"
  | "status"
  | "version"
  | "productId";
type depositGatewayCreationAttributes = Optional<
  depositGatewayAttributes,
  depositGatewayOptionalAttributes
>;
