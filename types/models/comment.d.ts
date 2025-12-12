


interface commentAttributes {
  id: string;
  content: string;
  userId: string;
  postId: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

type commentPk = "id";
type commentId = comment[commentPk];
type commentOptionalAttributes =
  | "id"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
type commentCreationAttributes = Optional<
  commentAttributes,
  commentOptionalAttributes
>;
