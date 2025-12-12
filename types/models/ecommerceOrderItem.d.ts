


interface ecommerceOrderItemAttributes {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  key?: string;
  filePath?: string;
}

type ecommerceOrderItemPk = "id";
type ecommerceOrderItemId = ecommerceOrderItem[ecommerceOrderItemPk];
type ecommerceOrderItemOptionalAttributes = "id" | "key";
type ecommerceOrderItemCreationAttributes = Optional<
  ecommerceOrderItemAttributes,
  ecommerceOrderItemOptionalAttributes
>;
