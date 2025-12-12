// /api/mlmReferralRewards/structure.get.ts

import { models } from "@b/db";
import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for MLM Referral Rewards",
  operationId: "getMlmReferralRewardStructure",
  tags: ["Admin", "MLM Referral Rewards"],
  responses: {
    200: {
      description: "Form structure for managing MLM Referral Rewards",
      content: structureSchema,
    },
  },
  permission: "Access MLM Referral Reward Management",
};

export const mlmReferralRewardStructure = async () => {
  const conditions = await models.mlmReferralCondition.findAll({
    where: {
      status: true,
    },
  });

  const reward = {
    type: "input",
    label: "Reward Amount",
    name: "reward",
    placeholder: "Enter the reward amount",
    required: true,
    ts: "number",
    icon: "marketeq:reward",
  };

  const isClaimed = {
    type: "select",
    label: "Is Claimed?",
    name: "isClaimed",
    required: true,
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
    ts: "boolean",
  };

  const conditionId = {
    type: "select",
    label: "Condition",
    name: "conditionId",
    placeholder: "Select the condition",
    options: conditions.map((condition) => ({
      value: condition.id,
      label: condition.name,
    })),
    icon: "ci:list-check",
  };

  const referrerId = {
    type: "input",
    label: "Referrer ID",
    name: "referrerId",
    placeholder: "Enter the referrer's user ID",
    required: true,
    icon: "lets-icons:user-duotone",
  };

  return {
    reward,
    isClaimed,
    conditionId,
    referrerId,
  };
};

export default async (): Promise<object> => {
  const { reward, isClaimed, conditionId, referrerId } =
    await mlmReferralRewardStructure();

  return {
    get: [reward, conditionId, referrerId, isClaimed],
    set: [reward, conditionId, referrerId, isClaimed],
  };
};
