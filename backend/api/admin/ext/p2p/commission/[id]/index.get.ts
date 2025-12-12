import {
  getRecord,
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { baseP2pCommissionSchema } from "../utils";
import { models } from "@b/db";

export const metadata = {
  summary: "Retrieves detailed information of a specific P2P Commission by ID",
  operationId: "getP2pCommissionById",
  tags: ["Admin","P2P", "Commissions"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the P2P Commission to retrieve",
      schema: { type: "string" },
    },
  ],
  responses: {
    200: {
      description: "P2P Commission details",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: baseP2pCommissionSchema, // Define this schema in your utils if it's not already defined
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("P2P Commission"),
    500: serverErrorResponse,
  },
  permission: "Access P2P Commission Management",
  requiresAuth: true,
};

export default async (data) => {
  const { params } = data;

  return await getRecord("p2pCommission", params.id, [
    {
      model: models.p2pTrade,
      as: "trade",
      attributes: ["id", "status"],
    },
  ]);
};
