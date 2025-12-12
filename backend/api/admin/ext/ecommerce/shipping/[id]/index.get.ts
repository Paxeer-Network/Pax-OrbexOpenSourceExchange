// /server/api/ecommerce/Shipping/[id].get.ts

import {
  getRecord,
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { models } from "@b/db";
import { ecommerceShippingchema } from "../utils";

export const metadata: OperationObject = {
  summary:
    "Retrieves detailed information of a specific ecommerce shipping by ID",
  operationId: "getEcommerceShippingById",
  tags: ["Admin", "Ecommerce Shipping"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the ecommerce shipping to retrieve",
      schema: { type: "string" },
    },
  ],
  responses: {
    200: {
      description: "Ecommerce shipping details",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: ecommerceShippingchema, // Define this schema in your utils if it's not already defined
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Ecommerce Shipping"),
    500: serverErrorResponse,
  },
  permission: "Access Ecommerce Shipping Management",
  requiresAuth: true,
};

export default async (data) => {
  const { params } = data;

  return await getRecord("ecommerceShipping", params.id, [
    {
      model: models.ecommerceOrder,
      as: "ecommerceOrders",
      includeModels: [
        {
          model: models.ecommerceOrderItem,
          as: "ecommerceOrderItems",
          attributes: ["orderId", "productId", "quantity"],
        },
      ],
    },
  ]);
};
