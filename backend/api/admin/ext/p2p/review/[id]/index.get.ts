import {
  getRecord,
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { baseP2pReviewSchema } from "../utils";
import { models } from "@b/db";

export const metadata = {
  summary: "Retrieves detailed information of a specific P2P Review by ID",
  operationId: "getP2pReviewById",
  tags: ["Admin","P2P", "Review"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the P2P Review to retrieve",
      schema: { type: "string" },
    },
  ],
  responses: {
    200: {
      description: "P2P Review details",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: baseP2pReviewSchema, // Define this schema in your utils if it's not already defined
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("P2P Review"),
    500: serverErrorResponse,
  },
  permission: "Access P2P Review Management",
  requiresAuth: true,
};

export default async (data) => {
  const { params } = data;

  return await getRecord("p2pReview", params.id, [
    {
      model: models.p2pOffer,
      as: "offer",
      attributes: ["id", "status", "currency"],
    },
    {
      model: models.user,
      as: "reviewer",
      attributes: ["firstName", "lastName", "email", "avatar"],
    },
    {
      model: models.user,
      as: "reviewed",
      attributes: ["firstName", "lastName", "email", "avatar"],
    },
  ]);
};
