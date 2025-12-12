import { models } from "@b/db";
import {
  getRecord,
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { baseStakingDurationSchema } from "../utils";

export const metadata = {
  summary:
    "Retrieves detailed information of a specific Staking Duration by ID",
  operationId: "getStakingDurationById",
  tags: ["Admin","Staking Durations"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the Staking Duration to retrieve",
      schema: { type: "string" },
    },
  ],
  responses: {
    200: {
      description: "Staking Duration details",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: baseStakingDurationSchema, // Define this schema in your utils if it's not already defined
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Staking Duration"),
    500: serverErrorResponse,
  },
  permission: "Access Staking Duration Management",
  requiresAuth: true,
};

export default async (data) => {
  const { params } = data;

  return await getRecord("stakingDuration", params.id, [
    {
      model: models.stakingPool,
      as: "pool",
      attributes: ["id", "name", "status"],
    },
  ]);
};
