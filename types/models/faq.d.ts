


interface faqAttributes {
  id: string;
  faqCategoryId: string;
  question: string;
  answer: string;
  videoUrl?: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

type faqPk = "id";
type faqId = faq[faqPk];
type faqOptionalAttributes =
  | "id"
  | "videoUrl"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
type faqCreationAttributes = Optional<
  faqAttributes,
  faqOptionalAttributes
>;
