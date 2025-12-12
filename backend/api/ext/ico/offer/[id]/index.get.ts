import { models } from "@b/db";
import { createError } from "@b/utils/error";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { baseIcoTokenSchema } from "../../utils";

export const metadata: OperationObject = {
  summary: "Retrieves a specific ICO token",
  description:
    "Fetches details of a specific ICO token by ID, including phase and contribution details.",
  operationId: "getIcoToken",
  tags: ["ICO", "Tokens"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string", description: "Project ID" },
    },
  ],
  responses: {
    200: {
      description: "ICO token retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: baseIcoTokenSchema,
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Ico Token"),
    500: serverErrorResponse,
  },
};

export default async (data: Handler) => {
  const { params } = data;
  const { id } = params;

  const token = (await models.icoToken.findByPk(id, {
    include: [
      {
        model: models.icoPhase,
        as: "icoPhases",
        attributes: [
          "id",
          "name",
          "startDate",
          "endDate",
          "price",
          "status",
          "minPurchase",
          "maxPurchase",
        ],
        include: [
          {
            model: models.icoContribution,
            as: "icoContributions",
            attributes: ["id", "amount"],
          },
        ],
      },
      {
        model: models.icoAllocation,
        as: "icoAllocation",
        attributes: ["id", "name", "percentage"],
      },
      {
        model: models.icoProject,
        as: "project",
        attributes: ["id", "name", "description", "website", "whitepaper"],
      },
    ],
  })) as any;

  if (!token) {
    throw createError({
      statusCode: 404,
      message: "Token not found",
    });
  }

  const { icoPhases, icoAllocation, project, ...restOfData } = token.get({
    plain: true,
  });

  const phases = icoPhases?.map((phase) => {
    const totalContributions =
      phase.icoContributions?.reduce(
        (sum, contribution) => sum + (contribution.amount ?? 0),
        0
      ) ?? 0;

    const totalSupply = token.totalSupply ?? 0; // Ensure totalSupply is defined
    const percentage =
      totalSupply > 0 ? (totalContributions / totalSupply) * 100 : 0;

    return {
      id: phase.id,
      name: phase.name,
      startDate: phase.startDate,
      endDate: phase.endDate,
      price: phase.price,
      status: phase.status,
      minPurchase: phase.minPurchase,
      maxPurchase: phase.maxPurchase,
      contributionPercentage: parseFloat(percentage.toFixed(8)),
      contributions: phase.icoContributions?.length ?? 0,
    };
  });

  const saleAmount =
    ((icoAllocation?.percentage ?? 0) / 100) * (token.totalSupply ?? 0);

  return { phases, icoAllocation, project, saleAmount, ...restOfData };
};
