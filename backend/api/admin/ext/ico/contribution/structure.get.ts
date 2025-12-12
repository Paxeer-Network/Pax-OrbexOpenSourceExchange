// /api/icoContributions/structure.get.ts

import { models } from "@b/db";
import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for ICO Contributions",
  operationId: "getIcoContributionStructure",
  tags: ["Admin","ICO Contributions"],
  responses: {
    200: {
      description: "Form structure for managing ICO Contributions",
      content: structureSchema,
    },
  },
  permission: "Access ICO Contribution Management"
};

export const icoContributionStructure = async () => {
  const phases = await models.icoPhase.findAll();
  const userId = {
    type: "input",
    label: "User",
    name: "userId",
    placeholder: "Enter the user ID",
    icon: "lets-icons:user-duotone",
  };

  const phaseId = {
    type: "select",
    label: "Phase",
    name: "phaseId",
    options: phases.map((phase) => ({
      value: phase.id,
      label: phase.name,
    })),
    placeholder: "Select the phase",
  };

  const amount = {
    type: "input",
    label: "Amount",
    name: "amount",
    placeholder: "Enter the contribution amount",
    ts: "number",
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    options: [
      { value: "PENDING", label: "Pending" },
      { value: "COMPLETED", label: "Completed" },
      { value: "CANCELLED", label: "Cancelled" },
      { value: "REJECTED", label: "Rejected" },
    ],
    placeholder: "Select the status of the contribution",
  };

  return {
    userId,
    phaseId,
    amount,
    status,
  };
};

export default async (): Promise<object> => {
  const { userId, phaseId, amount, status } = await icoContributionStructure();

  return {
    get: [
      userId,
      {
        type: "input",
        label: "Phase",
        name: "phase.name",
        icon: "ph:wallet-light",
      },
      amount,
      status,
    ],
    set: [userId, phaseId, [amount, status]],
  };
};
