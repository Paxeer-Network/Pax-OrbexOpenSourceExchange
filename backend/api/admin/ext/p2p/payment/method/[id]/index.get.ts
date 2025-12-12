import {
  getRecord,
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { baseP2pPaymentMethodSchema } from "../utils";
import { models } from "@b/db";

export const metadata = {
  summary:
    "Retrieves detailed information of a specific P2P Payment Method by ID",
  operationId: "getP2pPaymentMethodById",
  tags: ["Admin","P2P", "Payment Method"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the P2P Payment Method to retrieve",
      schema: { type: "string" },
    },
  ],
  responses: {
    200: {
      description: "P2P Payment Method details",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: baseP2pPaymentMethodSchema,
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("P2P Payment Method"),
    500: serverErrorResponse,
  },
  permission: "Access P2P Payment Method Management",
  requiresAuth: true,
};

export default async (data) => {
  const { params } = data;

  return await getRecord("p2pPaymentMethod", params.id, [
    {
      model: models.user,
      as: "user",
      attributes: ["firstName", "lastName", "email", "avatar"],
    },
  ]);
};
