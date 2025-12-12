// /api/admin/ecommerceCategories/structure.get.ts

import { structureSchema } from "@b/utils/constants";
import { imageStructure, imageStructureMd } from "@b/utils/schema/structure";

export const metadata = {
  summary: "Get form structure for E-commerce Categories",
  operationId: "getEcommerceCategoryStructure",
  tags: ["Admin", "Ecommerce Categories"],
  responses: {
    200: {
      description: "Form structure for managing E-commerce Categories",
      content: structureSchema,
    },
  },
  permission: "Access Ecommerce Category Management",
};

export const ecommerceCategoryStructure = () => {
  const name = {
    type: "input",
    label: "Name",
    name: "name",
    component: "InfoBlock",
    placeholder: "Enter the category name",
    icon: "iconamoon:category-thin",
  };

  const description = {
    type: "textarea",
    label: "Description",
    name: "description",
    placeholder: "Enter a description for the category",
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    ts: "boolean",
    options: [
      { label: "Active", value: true },
      { label: "Inactive", value: false },
    ],
  };

  return {
    name,
    description,
    status,
  };
};

export default async (): Promise<object> => {
  const { name, description, status } = ecommerceCategoryStructure();

  return {
    get: [
      {
        fields: [
          {
            ...imageStructure,
            width: imageStructure.width / 4,
            height: imageStructure.width / 4,
          },
          {
            fields: [name],
            grid: "column",
          },
        ],
        className: "card-dashed mb-5 items-center",
      },
      description,
      status,
    ],
    set: [imageStructureMd, [name, status], description],
  };
};
