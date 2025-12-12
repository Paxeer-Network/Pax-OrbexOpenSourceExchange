// /api/admin/faqCategories/structure.get.ts

import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for FAQ Categories",
  operationId: "getFaqCategoryStructure",
  tags: ["Admin", "FAQ Categories"],
  responses: {
    200: {
      description: "Form structure for managing FAQ Categories",
      content: structureSchema,
    },
  },
  permission: "Access FAQ Category Management",
};

export const faqCategoryStructure = () => {
  const id = {
    type: "input",
    label: "ID",
    name: "id",
    placeholder: "Enter a unique id for the FAQ category",
  };

  return {
    id,
  };
};

export default (): object => {
  const { id } = faqCategoryStructure();

  return {
    get: [id],
    set: [id],
  };
};
