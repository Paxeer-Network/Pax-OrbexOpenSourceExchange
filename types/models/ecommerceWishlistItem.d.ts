


interface ecommerceWishlistItemAttributes {
  id: string;
  wishlistId: string;
  productId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type ecommerceWishlistItemPk = "id";
type ecommerceWishlistItemId =
  ecommerceWishlistItem[ecommerceWishlistItemPk];
type ecommerceWishlistItemOptionalAttributes =
  | "id"
  | "createdAt"
  | "updatedAt";
type ecommerceWishlistItemCreationAttributes = Optional<
  ecommerceWishlistItemAttributes,
  ecommerceWishlistItemOptionalAttributes
>;
