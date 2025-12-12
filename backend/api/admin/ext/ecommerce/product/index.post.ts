// /api/admin/ecommerce/products/store.post.ts

import { storeRecord, storeRecordResponses } from "@b/utils/query";
import {
  ecommerceProductStoreSchema,
  ecommerceProductUpdateSchema,
} from "./utils";
import { models } from "@b/db";

export const metadata: OperationObject = {
  summary: "Stores a new E-commerce Product",
  operationId: "storeEcommerceProduct",
  tags: ["Admin", "Ecommerce Products"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: ecommerceProductUpdateSchema,
      },
    },
  },
  responses: storeRecordResponses(
    ecommerceProductStoreSchema,
    "E-commerce Product"
  ),
  requiresAuth: true,
  permission: "Access Ecommerce Product Management",
};

export default async (data: Handler) => {
  const { body } = data;
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
    image,
    currency,
    walletType,
  } = body;

  const existingProduct = await models.ecommerceProduct.findOne({
    where: { name },
  });

  if (existingProduct) {
    throw new Error("Product with this name already exists");
  }

  return await storeRecord({
    model: "ecommerceProduct",
    data: {
      name,
      description,
      shortDescription,
      type,
      price,
      categoryId,
      inventoryQuantity,
      filePath,
      status,
      image,
      currency,
      walletType,
    },
  });
};
