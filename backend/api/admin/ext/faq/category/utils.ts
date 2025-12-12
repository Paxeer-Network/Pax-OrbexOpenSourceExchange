import { baseStringSchema } from "@b/utils/schema";

const id = baseStringSchema("ID of the FAQ category");
const faqItem = {
  type: "object",
  properties: {
    id: baseStringSchema("ID of the FAQ"),
    question: baseStringSchema("Question text"),
    answer: baseStringSchema("Answer text"),
  },
};

export const faqCategorySchema = {
  id,
  faqs: {
    type: "array",
    items: faqItem,
  },
};

export const baseFaqCategorySchema = {
  id,
};
