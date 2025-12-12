


interface faqCategoryAttributes {
  id: string;
}

type faqCategoryPk = "id";
type faqCategoryId = faqCategory[faqCategoryPk];
type faqCategoryOptionalAttributes = "id";
type faqCategoryCreationAttributes = Optional<
  faqCategoryAttributes,
  faqCategoryOptionalAttributes
>;
