


interface ecommerceWishlistAttributes {
  id: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type ecommerceWishlistPk = "id";
type ecommerceWishlistId = ecommerceWishlist[ecommerceWishlistPk];
type ecommerceWishlistOptionalAttributes =
  | "id"
  | "createdAt"
  | "updatedAt";
type ecommerceWishlistCreationAttributes = Optional<
  ecommerceWishlistAttributes,
  ecommerceWishlistOptionalAttributes
>;
