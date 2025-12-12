import {
  getRecord,
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { baseP2pEscrowSchema } from "../utils";
import { models } from "@b/db";

export const metadata = {
  summary: "Retrieves detailed information of a specific P2P Escrow by ID",
  operationId: "getP2pEscrowById",
  tags: ["Admin","P2P", "Escrow"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the P2P Escrow to retrieve",
      schema: { type: "string" },
    },
  ],
  responses: {
    200: {
      description: "P2P Escrow details",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: baseP2pEscrowSchema, // Define this schema in your utils if it's not already defined
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("P2P Escrow"),
    500: serverErrorResponse,
  },
  permission: "Access P2P Escrow Management",
  requiresAuth: true,
};

export default async (data) => {
  const { params } = data;

  return await getRecord("p2pEscrow", params.id, [
    {
      model: models.p2pTrade,
      as: "trade",
      attributes: ["id", "status"],
    },
  ]);
};
