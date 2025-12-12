import {
  baseStringSchema,
  baseNumberSchema,
  baseIntegerSchema,
  baseObjectSchema,
  baseDateTimeSchema,
} from "@b/utils/schema";
import { models, sequelize } from "@b/db";

export const baseIcoAllocationSchema = {
  id: baseStringSchema("Allocation ID"),
  projectId: baseStringSchema("Associated project ID"),
  amount: baseNumberSchema("Allocated amount"),
  status: baseStringSchema("Allocation status"),
};

export const baseIcoContributionSchema = {
  id: baseStringSchema("Contribution ID"),
  userId: baseStringSchema("User ID"),
  phaseId: baseStringSchema("Phase ID"),
  amount: baseNumberSchema("Contributed amount"),
  status: baseStringSchema("Contribution status"),
  phase: {
    type: "object",
    properties: {
      token: {
        type: "object",
        properties: {
          id: baseStringSchema("Token ID"),
          name: baseStringSchema("Token name"),
        },
      },
    },
  },
};

export const baseIcoTokenSchema = {
  id: baseStringSchema("ICO token ID"),
  name: baseStringSchema("Token name"),
  status: baseStringSchema("Token status"),
  phases: {
    type: "array",
    items: {
      type: "object",
      properties: {
        id: baseStringSchema("Phase ID"),
        phaseName: baseStringSchema("Phase name"),
        status: baseStringSchema("Phase status"),
        contributionPercentage: baseNumberSchema("Contribution percentage"),
        contributionsCount: baseIntegerSchema("Total contributions count"),
      },
    },
  },
};

export const baseIcoPhaseSchema = {
  id: baseStringSchema("Phase ID"),
  phaseName: baseStringSchema("Phase name"),
  status: baseStringSchema("Phase status"),
  startDate: baseDateTimeSchema("Start date"),
  endDate: baseDateTimeSchema("End date"),
  token: baseObjectSchema("Associated token details"),
};

export const baseIcoProjectSchema = {
  id: baseStringSchema("ICO project ID"),
  name: baseStringSchema("Project name"),
  description: baseStringSchema("Project description"),
  status: baseStringSchema("Project status"),
};

export async function updateTokensWithPhases(tokens) {
  const currentDate = new Date();

  if (!tokens) {
    return [];
  }

  const processPhase = async (phase, token) => {
    if (currentDate >= phase.endDate && phase.status === "ACTIVE") {
      await updatePhaseStatus(phase.id, "COMPLETED");
      phase.status = "COMPLETED";
    } else if (currentDate >= phase.startDate && phase.status === "PENDING") {
      await updatePhaseStatus(phase.id, "ACTIVE");
      phase.status = "ACTIVE";
      return { phase, isAnyPhasePending: true, isAllPhasesCompleted: false };
    } else if (phase.status === "ACTIVE" || phase.status === "PENDING") {
      return { phase, isAnyPhasePending: false, isAllPhasesCompleted: false };
    }

    const totalContributions =
      phase.icoContributions?.reduce(
        (sum, contribution) => sum + contribution.amount,
        0
      ) || 0;
    const contributionCount = phase.icoContributions?.length || 0;
    const percentage = (totalContributions / token.totalSupply) * 100;

    return {
      phase: {
        ...phase.dataValues,
        contributionPercentage: parseFloat(percentage.toFixed(2)),
        contributions: contributionCount,
      },
      isAnyPhasePending: false,
      isAllPhasesCompleted: true,
    };
  };

  const processToken = async (token) => {
    let isAnyPhasePending = false;
    let isAllPhasesCompleted = true;

    const updatedPhases = await Promise.all(
      token.icoPhases?.map(async (phase) => {
        const {
          phase: updatedPhase,
          isAnyPhasePending: phasePending,
          isAllPhasesCompleted: phasesCompleted,
        } = await processPhase(phase, token);
        isAnyPhasePending = isAnyPhasePending || phasePending;
        isAllPhasesCompleted = isAllPhasesCompleted && phasesCompleted;
        return updatedPhase;
      }) || []
    );

    let newTokenStatus = token.status;
    if (isAnyPhasePending || !isAllPhasesCompleted) {
      newTokenStatus = "ACTIVE";
    } else if (!token.icoPhases?.length) {
      newTokenStatus = "PENDING";
    }

    if (token.status !== newTokenStatus) {
      await models.icoToken.update(
        { status: newTokenStatus },
        { where: { id: token.id } }
      );
    }

    return { ...token.dataValues, phases: updatedPhases };
  };

  return await Promise.all(tokens.map(processToken));
}
export async function updatePhaseStatus(phaseId, newStatus) {
  await sequelize.transaction(async (transaction) => {
    await models.icoPhase.update(
      { status: newStatus },
      { where: { id: phaseId }, transaction }
    );
  });
}
