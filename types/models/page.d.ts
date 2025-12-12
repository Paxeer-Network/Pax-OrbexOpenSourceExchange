interface pageAttributes {
  id: string;
  slug: string;
  path: string;
  title: string;
  content: string;
  description?: string;
  image?: string;
  visits: number;
  order: number;
  status: "PUBLISHED" | "DRAFT";
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

type pagePk = "id";
type pageId = page[pagePk];
type pageOptionalAttributes =
  | "id"
  | "description"
  | "image"
  | "status"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
type pageCreationAttributes = Optional<pageAttributes, pageOptionalAttributes>;
