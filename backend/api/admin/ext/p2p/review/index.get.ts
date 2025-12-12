// /server/api/p2p/reviews/index.get.ts

import { models } from "@b/db";

import { crudParameters, paginationSchema } from "@b/utils/constants";
import {
  getFiltered,
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { p2pReviewSchema } from "./utils";

export const metadata = {
  summary: "Lists P2P reviews with pagination and optional filtering",
  operationId: "listP2PReviews",
  tags: ["Admin","P2P", "Reviews"],
  parameters: crudParameters,
  responses: {
    200: {
      description: "List of P2P reviews with pagination information",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: p2pReviewSchema,
                },
              },
              pagination: paginationSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("P2P Reviews"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
  permission: "Access P2P Review Management",
};

export default async (data: Handler) => {
  const { query } = data;

  // Call the generic fetch function
  return getFiltered({
    model: models.p2pReview,
    query,
    sortField: query.sortField || "createdAt",
    includeModels: [
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
    ],
    // Assuming sensitive fields might be hidden
  });
};
