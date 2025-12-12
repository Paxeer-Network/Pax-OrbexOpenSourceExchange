import {
  getRecord,
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { baseIcoPhaseSchema } from "../utils";
import { models } from "@b/db";

export const metadata = {
  summary: "Retrieves detailed information of a specific ICO phase by ID",
  operationId: "getIcoPhaseById",
  tags: ["Admin", "ICO Phases"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the ICO phase to retrieve",
      schema: { type: "string" },
    },
  ],
  responses: {
    200: {
      description: "ICO phase details",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: baseIcoPhaseSchema, // Define this schema in your utils if it's not already defined
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("ICO Phase"),
    500: serverErrorResponse,
  },
  permission: "Access ICO Phase Management",
  requiresAuth: true,
};

export default async (data) => {
  const { params } = data;

  return await getRecord("icoPhase", params.id, [
    {
      model: models.icoToken,
      as: "token",
      attributes: ["name", "currency", "chain", "image"],
    },
  ]);
};
