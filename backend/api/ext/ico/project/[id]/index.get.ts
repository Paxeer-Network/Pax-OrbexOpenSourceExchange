import { models } from "@b/db";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { baseIcoProjectSchema } from "../../utils";
import { createError } from "@b/utils/error";

export const metadata: OperationObject = {
  summary: "Retrieves a specific ICO project",
  description: "Fetches details of a specific ICO project by ID.",
  operationId: "getIcoProject",
  tags: ["ICO", "Projects"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string", description: "ICO project ID" },
    },
  ],
  responses: {
    200: {
      description: "ICO project retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: baseIcoProjectSchema,
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
  const { params } = data;
  const { id } = params;

  const project = (await models.icoProject.findByPk(id, {
    include: [
      {
        model: models.icoToken,
        as: "icoTokens",
        attributes: [
          "id",
          "name",
          "chain",
          "currency",
          "purchaseCurrency",
          "purchaseWalletType",
          "address",
          "totalSupply",
          "description",
          "image",
          "status",
          "createdAt",
        ],
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
        ],
      },
    ],
  })) as any;

  if (!project) {
    throw createError(404, "Project not found");
  }

  const tokens = project.icoTokens.map((token) => {
    const phases = token.icoPhases.map((phase) => {
      const totalContributionAmount = phase.icoContributions.reduce(
        (sum, contribution) => sum + contribution.amount,
        0
      );
      const contributionPercentage =
        (totalContributionAmount / token.totalSupply) * 100;

      const totalContributions = phase.icoContributions.length;

      return {
        id: phase.id,
        name: phase.name,
        startDate: phase.startDate,
        endDate: phase.endDate,
        price: phase.price,
        status: phase.status,
        minPurchase: phase.minPurchase,
        maxPurchase: phase.maxPurchase,
        contributionPercentage: parseFloat(contributionPercentage.toFixed(2)),
        contributionAmount: totalContributionAmount,
        totalContributions,
      };
    });

    return {
      id: token.id,
      projectId: token.projectId,
      name: token.name,
      chain: token.chain,
      currency: token.currency,
      purchaseCurrency: token.purchaseCurrency,
      purchaseWalletType: token.purchaseWalletType,
      address: token.address,
      totalSupply: token.totalSupply,
      description: token.description,
      image: token.image,
      status: token.status,
      createdAt: token.createdAt,
      icoAllocation: token.icoAllocation,
      phases,
    };
  });

  const { icoTokens, ...restOfProject } = project.get({
    plain: true,
  });
  return {
    tokens,
    ...restOfProject,
  };
};
