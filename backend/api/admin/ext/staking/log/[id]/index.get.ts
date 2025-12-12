import { models } from "@b/db";
import {
  getRecord,
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { stakingLogSchema } from "../utils";

export const metadata = {
  summary: "Retrieves detailed information of a specific Staking Log by ID",
  operationId: "getStakingLogById",
  tags: ["Admin","Staking Logs"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the Staking Log to retrieve",
      schema: { type: "string" },
    },
  ],
  responses: {
    200: {
      description: "Staking Log details",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: stakingLogSchema,
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Staking Log"),
    500: serverErrorResponse,
  },
  permission: "Access Staking Management",
  requiresAuth: true,
};

export default async (data) => {
  const { params } = data;

  return await getRecord("stakingLog", params.id, [
    {
      model: models.user,
      as: "user",
      attributes: ["firstName", "lastName", "email", "avatar"],
    },
    {
      model: models.stakingPool,
      as: "pool",
      attributes: ["id", "name", "status", "icon"],
    },
  ]);
};
