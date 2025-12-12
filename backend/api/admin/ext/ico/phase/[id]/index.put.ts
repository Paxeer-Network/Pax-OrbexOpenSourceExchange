import { updateRecordResponses } from "@b/utils/query";
import { icoPhaseUpdateSchema } from "../utils";
import { models } from "@b/db";
import { Op } from "sequelize";

export const metadata = {
  summary: "Updates a specific ICO Phase",
  operationId: "updateIcoPhase",
  tags: ["Admin","ICO Phases"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      description: "ID of the ICO Phase to update",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    description: "New data for the ICO Phase",
    content: {
      "application/json": {
        schema: icoPhaseUpdateSchema,
      },
    },
  },
  responses: updateRecordResponses("ICO Phase"),
  requiresAuth: true,
  permission: "Access ICO Phase Management",
};

export default async (data: Handler) => {
  const { body, params } = data;
  const { id } = params;
  const { name, startDate, endDate, price, status, minPurchase, maxPurchase } =
    body;

  const phase = await models.icoPhase.findByPk(id);

  if (!phase) {
    throw new Error("Phase not found");
  }

  // Retrieve existing phases to check for overlap
  const existingPhases = await models.icoPhase.findAll({
    where: {
      tokenId: phase.tokenId,
      id: {
        [Op.ne]: id,
      },
      status: ["PENDING", "ACTIVE"],
    },
  });

  const isOverlap = existingPhases.some((phase) => {
    return (
      (startDate >= phase.startDate && startDate <= phase.endDate) ||
      (endDate >= phase.startDate && endDate <= phase.endDate) ||
      (startDate <= phase.startDate && endDate >= phase.endDate)
    );
  });

  if (isOverlap) {
    throw new Error(
      "Cannot update the phase due to overlap with an existing phase."
    );
  }

  const activePhase = await models.icoPhase.findOne({
    where: {
      tokenId: phase.tokenId,
      status: "ACTIVE",
      endDate: {
        lt: startDate,
      },
      id: {
        [Op.ne]: id,
      },
    },
  });

  let newStatus = status;
  if (activePhase) {
    newStatus = IcoPhaseStatus.PENDING;
  }

  await models.icoPhase.update(
    {
      name,
      startDate,
      endDate,
      price,
      status: newStatus,
      minPurchase,
      maxPurchase,
    },
    {
      where: { id },
    }
  );

  return { message: "Phase updated successfully" };
};
