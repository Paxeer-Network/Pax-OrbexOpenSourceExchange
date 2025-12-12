import {
  getRecord,
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { baseP2pTradeSchema } from "../utils";
import { models } from "@b/db";

export const metadata: OperationObject = {
  summary: "Retrieves detailed information of a specific P2P Trade by ID",
  operationId: "getP2pTradeById",
  tags: ["P2P", "Trade"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the P2P Trade to retrieve",
      schema: { type: "string" },
    },
  ],
  responses: {
    200: {
      description: "P2P Trade details",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: baseP2pTradeSchema, // Define this schema in your utils if it's not already defined
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("P2P Trade"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
};

export default async (data) => {
  const { params } = data;

  return await getRecord("p2pTrade", params.id, [
    {
      model: models.user,
      as: "user",
      attributes: ["id", "firstName", "lastName", "email", "avatar"],
    },
    {
      model: models.user,
      as: "seller",
      attributes: ["id", "firstName", "lastName", "email", "avatar"],
    },
    {
      model: models.p2pOffer,
      as: "offer",
      attributes: ["id", "status", "currency"],
      includeModels: [
        {
          model: models.p2pPaymentMethod,
          as: "paymentMethod",
        },
        {
          model: models.p2pReview,
          as: "p2pReviews",
          attributes: ["id", "rating", "comment", "createdAt"],
          includeModels: [
            {
              model: models.user,
              as: "reviewer",
              attributes: ["id", "firstName", "lastName", "email", "avatar"],
            },
          ],
        },
      ],
    },
    {
      model: models.p2pDispute,
      as: "p2pDisputes",
      attributes: ["id", "status", "resolution", "reason"],
      includeModels: [
        {
          model: models.user,
          as: "raisedBy",
          attributes: ["id", "firstName", "lastName", "email", "avatar"],
        },
      ],
    },
  ]);
};
