import { models } from "@b/db";
import {
  getRecord,
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { baseP2pDisputeSchema } from "../utils";

export const metadata = {
  summary: "Retrieves detailed information of a specific P2P Dispute by ID",
  operationId: "getP2pDisputeById",
  tags: ["Admin","P2P", "Disputes"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the P2P Dispute to retrieve",
      schema: { type: "string" },
    },
  ],
  responses: {
    200: {
      description: "P2P Dispute details",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: baseP2pDisputeSchema, // Define this schema in your utils if it's not already defined
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("P2P Dispute"),
    500: serverErrorResponse,
  },
  permission: "Access P2P Dispute Management",
  requiresAuth: true,
};

export default async (data) => {
  const { params } = data;

  return await getRecord("p2pDispute", params.id, [
    {
      model: models.p2pTrade,
      as: "trade",
      attributes: ["id", "status"],
    },
    {
      model: models.user,
      as: "raisedBy",
      attributes: ["firstName", "lastName", "email", "avatar"],
    },
  ]);
};
