// /api/admin/ecommerceProducts/structure.get.ts

import { structureSchema } from "@b/utils/constants";
import { models } from "@b/db";
import { imageStructure, imageStructureLg } from "@b/utils/schema/structure";
import { getCurrencyConditions } from "@b/utils/currency";
import { CacheManager } from "@b/utils/cache";

export const metadata = {
  summary: "Get form structure for E-commerce Products",
  operationId: "getEcommerceProductStructure",
  tags: ["Admin", "Ecommerce Products"],
  responses: {
    200: {
      description: "Form structure for managing E-commerce Products",
      content: structureSchema,
    },
  },
  permission: "Access Ecommerce Product Management",
};

export const ecommerceProductStructure = async () => {
  const categories = await models.ecommerceCategory.findAll();

  const name = {
    type: "input",
    component: "InfoBlock",
    icon: "material-symbols-light:title",
    label: "Name",
    name: "name",
    placeholder: "Enter the product name",
  };

  const description = {
    type: "textarea",
    label: "Description",
    name: "description",
    placeholder: "Enter the product description",
  };

  const shortDescription = {
    type: "textarea",
    label: "Short Description",
    name: "shortDescription",
    placeholder: "Enter the product short description",
  };

  const type = {
    type: "select",
    component: "InfoBlock",
    icon: "bxs:category",
    label: "Type",
    name: "type",
    placeholder: "Enter the product type",
    options: [
      { value: "DOWNLOADABLE", label: "Downloadable" },
      { value: "PHYSICAL", label: "Physical" },
    ],
  };

  const price = {
    type: "input",
    label: "Price",
    name: "price",
    placeholder: "Enter the product price",
    ts: "number",
    icon: "ph:currency-circle-dollar-light",
  };

  const categoryId = {
    type: "select",
    label: "Category",
    name: "categoryId",
    options: categories.map((category) => ({
      value: category.id,
      label: category.name,
    })),
    placeholder: "Select the product category",
  };

  const inventoryQuantity = {
    type: "input",
    label: "Inventory Quantity",
    name: "inventoryQuantity",
    placeholder: "Enter the inventory quantity",
    ts: "number",
  };

  const filePath = {
    type: "file",
    label: "File Path",
    name: "filePath",
    placeholder: "Upload a file related to the product",
    fileType: "file",
    condition: {
      type: "DOWNLOADABLE",
    },
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
    ts: "boolean",
  };

  const walletType = {
    type: "select",
    label: "Wallet Type",
    name: "walletType",
    options: [
      { value: "FIAT", label: "Fiat" },
      { value: "SPOT", label: "Spot" },
    ],
    placeholder: "Select wallet type",
  };

  const currencyConditions = await getCurrencyConditions();
  const cacheManager = CacheManager.getInstance();
  const extensions = await cacheManager.getExtensions();
  if (extensions.has("ecosystem")) {
    walletType.options.push({ value: "ECO", label: "Funding" });
  }

  const currency = {
    type: "select",
    label: "Currency",
    name: "currency",
    options: [],
    conditions: {
      walletType: currencyConditions,
    },
  };

  return {
    name,
    description,
    shortDescription,
    type,
    price,
    categoryId,
    inventoryQuantity,
    filePath,
    status,
    currency,
    walletType,
  };
};

export default async (): Promise<object> => {
  const {
    name,
    description,
    shortDescription,
    type,
    price,
    categoryId,
    inventoryQuantity,
    filePath,
    status,
    currency,
    walletType,
  } = await ecommerceProductStructure();

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
            fields: [
              name,
              type,
              {
                type: "input",
                component: "InfoBlock",
                label: "Category",
                name: "category.name",
                icon: "bxs:category",
              },
            ],
            grid: "column",
          },
        ],
        className: "card-dashed mb-3 items-center",
      },
      shortDescription,
      description,
      [price, inventoryQuantity],
      [walletType, currency],
      status,
    ],
    set: [
      imageStructureLg,
      name,
      shortDescription,
      description,
      [type, categoryId],
      filePath,
      [price, inventoryQuantity],
      [walletType, currency],
      status,
    ],
  };
};
