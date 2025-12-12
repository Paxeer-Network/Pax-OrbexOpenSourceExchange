import {
  getRecord,
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { baseIcoTokenSchema } from "../utils";
import { models } from "@b/db";

export const metadata = {
  summary: "Retrieves detailed information of a specific ICO token by ID",
  operationId: "getIcoTokenById",
  tags: ["Admin", "ICO Tokens"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the ICO token to retrieve",
      schema: { type: "string" },
    },
  ],
  responses: {
    200: {
      description: "ICO token details",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: baseIcoTokenSchema, // Define this schema in your utils if it's not already defined
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("ICO Token"),
    500: serverErrorResponse,
  },
  permission: "Access ICO Token Management",
  requiresAuth: true,
};

export default async (data) => {
  const { params } = data;

  return await getRecord("icoToken", params.id, [
    {
      model: models.icoProject,
      as: "project",
      attributes: ["id", "name"],
    },
  ]);
};
