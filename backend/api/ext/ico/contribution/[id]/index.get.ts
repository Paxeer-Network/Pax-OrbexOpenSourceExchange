import { models } from "@b/db";
import { createError } from "@b/utils/error";

import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { baseIcoContributionSchema } from "../../utils";

export const metadata: OperationObject = {
  summary: "Retrieves a specific ICO contribution",
  description: "Fetches details of a specific ICO contribution by ID.",
  operationId: "getIcoContribution",
  tags: ["ICO", "Contributions"],
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string", description: "Contribution ID" },
    },
  ],
  responses: {
    200: {
      description: "Contribution retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: baseIcoContributionSchema,
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Ico Contribution"),
    500: serverErrorResponse,
  },
};

export default async (data: Handler) => {
  const { params } = data;
  try {
    const contribution = await models.icoContribution.findByPk(params.id, {
      include: [
        {
          model: models.icoPhase,
          as: "phase",
          include: [
            {
              model: models.icoToken,
              as: "token",
            },
          ],
        },
      ],
    });
    if (!contribution) {
      return {
        statusCode: 404,
        message: "Contribution not found",
      };
    }
    return contribution;
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: `Failed to fetch contribution details: ${error.message}`,
    });
  }
};
