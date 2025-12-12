


interface icoProjectAttributes {
  id: string;
  name: string;
  description: string;
  website: string;
  whitepaper: string;
  image: string;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "REJECTED" | "CANCELLED";
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

type icoProjectPk = "id";
type icoProjectId = icoProject[icoProjectPk];
type icoProjectOptionalAttributes =
  | "id"
  | "status"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
type icoProjectCreationAttributes = Optional<
  icoProjectAttributes,
  icoProjectOptionalAttributes
>;
