


interface authorAttributes {
  id: string;
  userId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

type authorPk = "id";
type authorId = author[authorPk];
type authorOptionalAttributes =
  | "id"
  | "status"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
type authorCreationAttributes = Optional<
  authorAttributes,
  authorOptionalAttributes
>;
