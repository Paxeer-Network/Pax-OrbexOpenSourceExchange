import { storeRecordResponses } from "@b/utils/query";
import {
  calculateCurrentAllocation,
  icoAllocationStoreSchema,
  icoAllocationUpdateSchema,
} from "./utils";
import { models, sequelize } from "@b/db";

export const metadata = {
  summary: "Stores a new ICO Allocation",
  operationId: "storeIcoAllocation",
  tags: ["Admin", "ICO Allocations"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: icoAllocationUpdateSchema,
      },
    },
  },
  responses: storeRecordResponses(icoAllocationStoreSchema, "ICO Allocation"),
  requiresAuth: true,
  permission: "Access ICO Allocation Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { name, percentage, tokenId, status, phaseAllocations = [] } = body;

  await sequelize.transaction(async (t) => {
    const sumOfPercentages = phaseAllocations.reduce(
      (sum, detail) => sum + detail.percentage,
      0
    );

    // Ensure the sum does not exceed 100%
    if (sumOfPercentages > 100) {
      throw new Error("Sum of phase allocation percentages cannot exceed 100%");
    }

    // Check for unique phaseIds for the tokenId
    const existingPhases = await models.icoPhaseAllocation.findAll({
      include: [
        {
          model: models.icoPhase,
          as: "phase",
          where: {
            tokenId,
          },
        },
      ],
      transaction: t,
    });

    const existingPhaseIds = new Set(existingPhases.map((e) => e.phaseId));
    phaseAllocations.forEach((detail) => {
      if (existingPhaseIds.has(detail.phaseId)) {
        throw new Error(
          `Phase with ID ${detail.phaseId} already exists for this token`
        );
      }
    });

    const currentAllocation = await calculateCurrentAllocation(tokenId, t);
    if (currentAllocation + percentage > 100) {
      throw new Error("Total allocation percentage cannot exceed 100%");
    }

    const allocation = await models.icoAllocation.create(
      {
        name,
        percentage,
        tokenId,
        status,
      },
      { transaction: t }
    );

    for (const detail of phaseAllocations) {
      await models.icoPhaseAllocation.create(
        {
          allocationId: allocation.id,
          phaseId: detail.phaseId,
          percentage: detail.percentage,
        },
        { transaction: t }
      );
    }
  });

  return { message: "ICO Allocation created successfully" };
};
