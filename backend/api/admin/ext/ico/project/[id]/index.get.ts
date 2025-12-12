import {
  getRecord,
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { baseIcoProjectSchema } from "../utils";

export const metadata = {
  summary: "Retrieves detailed information of a specific ICO project by ID",
  operationId: "getIcoProjectById",
  tags: ["Admin", "ICO Projects"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the ICO project to retrieve",
      schema: { type: "string" },
    },
  ],
  responses: {
    200: {
      description: "ICO project details",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: baseIcoProjectSchema, // Define this schema in your utils if it's not already defined
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("ICO Project"),
    500: serverErrorResponse,
  },
  permission: "Access ICO Project Management",
  requiresAuth: true,
};

export default async (data) => {
  const { params } = data;

  return await getRecord("icoProject", params.id);
};
