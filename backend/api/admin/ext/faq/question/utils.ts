import { baseStringSchema } from "@b/utils/schema";

const id = baseStringSchema("ID of the FAQ");
const faqCategoryId = baseStringSchema(
  "FAQ Category ID associated with the FAQ"
);
const question = baseStringSchema("Question text of the FAQ", 5000);
const answer = baseStringSchema("Answer text of the FAQ", 5000);
const videoUrl = baseStringSchema("Video URL of the FAQ");

export const faqSchema = {
  id,
  faqCategoryId,
  question,
  answer,
  videoUrl,
};

export const baseFaqSchema = {
  id,
  faqCategoryId,
  question,
  answer,
  videoUrl,
};

export const faqUpdateSchema = {
  type: "object",
  properties: {
    faqCategoryId,
    question,
    answer,
    videoUrl,
  },
  required: ["faqCategoryId", "question", "answer"],
};

export const faqStoreSchema = {
  description: `FAQ created or updated successfully`,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: baseFaqSchema,
      },
    },
  },
};
