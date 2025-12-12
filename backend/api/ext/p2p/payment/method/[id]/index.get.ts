import {
  getRecord,
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { baseP2pPaymentMethodSchema } from "../utils";
import { createError } from "@b/utils/error";

export const metadata: OperationObject = {
  summary:
    "Retrieves detailed information of a specific P2P Payment Method by ID",
  operationId: "getP2pPaymentMethodById",
  tags: ["P2P", "Payment Methods"],
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
  requiresAuth: true,
};

export default async (data) => {
  const { user, params } = data;
  if (!user?.id) throw createError(401, "Unauthorized");

  return await getRecord("p2pPaymentMethod", params.id);
};
