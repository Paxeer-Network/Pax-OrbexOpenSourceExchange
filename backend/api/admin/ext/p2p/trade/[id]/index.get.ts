import {
  getRecord,
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { baseP2pTradeSchema } from "../utils";
import { models } from "@b/db";

export const metadata = {
  summary: "Retrieves detailed information of a specific P2P Trade by ID",
  operationId: "getP2pTradeById",
  tags: ["Admin","P2P", "Trade"],
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
  permission: "Access P2P Trade Management",
  requiresAuth: true,
};

export default async (data) => {
  const { params } = data;

  return await getRecord("p2pTrade", params.id, [
    {
      model: models.user,
      as: "user",
      attributes: ["firstName", "lastName", "email", "avatar"],
    },
    {
      model: models.user,
      as: "seller",
      attributes: ["firstName", "lastName", "email", "avatar"],
    },
    {
      model: models.p2pOffer,
      as: "offer",
      attributes: ["id", "status", "currency"],
    },
    {
      model: models.p2pDispute,
      as: "p2pDisputes",
      attributes: ["id", "status"],
    },
  ]);
};
