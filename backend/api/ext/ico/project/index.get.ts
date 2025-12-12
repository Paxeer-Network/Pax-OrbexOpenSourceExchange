import { models } from "@b/db";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { baseIcoProjectSchema } from "../utils";

// Metadata and controller for fetching all ICO projects
export const metadata: OperationObject = {
  summary: "Retrieves all ICO projects",
  description: "Fetches a list of all ICO projects available.",
  operationId: "listIcoProjects",
  tags: ["ICO", "Projects"],
  responses: {
    200: {
      description: "ICO projects retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: baseIcoProjectSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Ico Project"),
    500: serverErrorResponse,
  },
};

export default async (data: Handler) => {
  const projects = await models.icoProject.findAll({
    where: { status: "ACTIVE" },
  });
  return projects;
};
