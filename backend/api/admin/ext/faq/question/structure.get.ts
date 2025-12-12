// /api/admin/faqs/structure.get.ts

import { structureSchema } from "@b/utils/constants";
import { models } from "@b/db";

export const metadata = {
  summary: "Get form structure for FAQs",
  operationId: "getFaqStructure",
  tags: ["Admin", "FAQs"],
  responses: {
    200: {
      description: "Form structure for managing FAQs",
      content: structureSchema,
    },
  },
  permission: "Access FAQ Management",
};

export const faqStructure = async () => {
  const categories = await models.faqCategory.findAll();

  const faqCategoryId = {
    type: "select",
    label: "FAQ Category",
    name: "faqCategoryId",
    options: categories.map((category) => ({
      value: category.id,
      label: category.id, // Assuming the category model has a name field
    })),
    placeholder: "Select the FAQ category",
  };

  const question = {
    type: "textarea",
    label: "Question",
    name: "question",
    placeholder: "Enter the FAQ question",
  };

  const answer = {
    type: "textarea",
    label: "Answer",
    name: "answer",
    placeholder: "Enter the answer to the FAQ",
  };

  const videoUrl = {
    type: "input",
    label: "Video URL",
    name: "videoUrl",
    placeholder:
      "Enter the video URL for the FAQ (e.g. https://www.youtube.com/watch?v=videoId",
    description:
      "This will be displayed as a video in the FAQ, e.g. https://www.youtube.com/watch?v=videoId",
  };

  return {
    faqCategoryId,
    question,
    answer,
    videoUrl,
  };
};

export default async () => {
  const { faqCategoryId, question, answer, videoUrl } = await faqStructure();

  return {
    get: [faqCategoryId, question, answer, videoUrl],
    set: [faqCategoryId, question, answer, videoUrl],
  };
};
