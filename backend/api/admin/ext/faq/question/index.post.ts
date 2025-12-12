// /api/admin/faqs/store.post.ts

import { storeRecord, storeRecordResponses } from "@b/utils/query";
import { faqStoreSchema, faqUpdateSchema } from "./utils";

export const metadata: OperationObject = {
  summary: "Stores a new FAQ",
  operationId: "storeFaq",
  tags: ["Admin", "FAQs"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: faqUpdateSchema,
      },
    },
  },
  responses: storeRecordResponses(faqStoreSchema, "FAQ"),
  requiresAuth: true,
  permission: "Access FAQ Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { faqCategoryId, question, answer, videoUrl } = body;

  return await storeRecord({
    model: "faq",
    data: {
      faqCategoryId,
      question,
      answer,
      videoUrl,
    },
  });
};
