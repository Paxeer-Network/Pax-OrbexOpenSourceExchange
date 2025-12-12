import { baseStringSchema, baseNumberSchema } from "@b/utils/schema";

export const baseFAQSchema = {
  id: baseNumberSchema("FAQ ID"),
  question: baseStringSchema("FAQ question"),
  answer: baseStringSchema("FAQ answer"),
  categoryId: baseNumberSchema("Category ID"),
  videoUrl: baseStringSchema("FAQ video URL"),
};

export const baseFAQCategorySchema = {
  id: baseNumberSchema("Category ID"),
  title: baseStringSchema("Category title"),
  categoryId: baseStringSchema("Category id"),
  faqs: {
    type: "array",
    description: "List of FAQs in this category",
    items: {
      type: "object",
      properties: baseFAQSchema,
    },
  },
};
