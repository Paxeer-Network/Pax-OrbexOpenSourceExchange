// /api/admin/ico/phases/store.post.ts

import { storeRecordResponses } from "@b/utils/query";
import { icoPhaseStoreSchema, icoPhaseUpdateSchema } from "./utils";
import { models } from "@b/db";

export const metadata = {
  summary: "Stores a new ICO Phase",
  operationId: "storeIcoPhase",
  tags: ["Admin", "ICO Phases"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: icoPhaseUpdateSchema,
      },
    },
  },
  responses: storeRecordResponses(icoPhaseStoreSchema, "ICO Phase"),
  requiresAuth: true,
  permission: "Access ICO Phase Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const {
    name,
    startDate,
    endDate,
    price,
    status,
    tokenId,
    minPurchase,
    maxPurchase,
  } = body;

  const existingPhases = await models.icoPhase.findAll({
    where: {
      tokenId,
      status: ["PENDING", "ACTIVE"],
    },
  });

  // Check for overlap with new phase startDate and endDate
  const isOverlap = existingPhases.some((phase) => {
    return (
      (startDate >= phase.startDate && startDate <= phase.endDate) || // New phase starts in the middle of an existing phase
      (endDate >= phase.startDate && endDate <= phase.endDate) || // New phase ends in the middle of an existing phase
      (startDate <= phase.startDate && endDate >= phase.endDate) // New phase wraps around an existing phase
    );
  });

  if (isOverlap) {
    throw new Error(
      "Cannot create a new phase due to overlap with an existing phase."
    );
  }

  // Then check if the allocation is used up or a phase is still active
  if (!(await canCreatePhase(tokenId))) {
    throw new Error(
      "Cannot create a new phase as the token allocation is used up or a phase is still active"
    );
  }

  const activePhase = await models.icoPhase.findOne({
    where: {
      tokenId: tokenId,
      status: "ACTIVE",
      endDate: {
        lt: startDate,
      },
    },
  });

  let newStatus = status;
  if (activePhase) {
    newStatus = IcoPhaseStatus.PENDING;
  }

  return await models.icoPhase.create({
    name,
    startDate,
    endDate,
    price,
    tokenId,
    status: newStatus,
    minPurchase,
    maxPurchase,
  });
};

async function canCreatePhase(tokenId: number): Promise<boolean> {
  const tokenWithPhases = (await models.icoToken.findByPk(tokenId, {
    include: [
      {
        model: models.icoPhase,
        as: "icoPhases",
      },
    ],
  })) as any;

  if (!tokenWithPhases) {
    throw new Error("Token not found");
  }

  // Calculate the sum of max purchase amounts for all completed or active phases
  const sumAllocatedForPhases = tokenWithPhases.icoPhases.reduce(
    (sum, phase) => {
      if (phase.status === "COMPLETED" || phase.status === "ACTIVE") {
        return sum + phase.maxPurchase;
      }
      return sum;
    },
    0
  );

  return sumAllocatedForPhases < tokenWithPhases.totalSupply;
}
