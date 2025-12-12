


interface ecommerceUserDiscountAttributes {
  id: string;
  userId: string;
  discountId: string;
  status: boolean;
}

type ecommerceUserDiscountPk = "id";
type ecommerceUserDiscountId =
  ecommerceUserDiscount[ecommerceUserDiscountPk];
type ecommerceUserDiscountOptionalAttributes = "id" | "status";
type ecommerceUserDiscountCreationAttributes = Optional<
  ecommerceUserDiscountAttributes,
  ecommerceUserDiscountOptionalAttributes
>;
