import {
  getRecord,
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { baseIcoAllocationSchema } from "../utils";
import { models } from "@b/db";

export const metadata = {
  summary: "Retrieves detailed information of a specific ICO allocation by ID",
  operationId: "getIcoAllocationById",
  tags: ["Admin", "ICO Allocations"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the ICO allocation to retrieve",
      schema: { type: "string" },
    },
  ],
  responses: {
    200: {
      description: "ICO allocation details",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: baseIcoAllocationSchema, // Define this schema in your utils if it's not already defined
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("ICO Allocation"),
    500: serverErrorResponse,
  },
  permission: "Access ICO Allocation Management",
  requiresAuth: true,
};

export default async (data) => {
  const { params } = data;

  return await getRecord("icoAllocation", params.id, [
    {
      model: models.icoToken,
      as: "token",
      attributes: ["name", "currency", "chain", "image"],
    },
  ]);
};
