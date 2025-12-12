// /api/admin/aiInvestments/structure.get.ts

import { models } from "@b/db";
import { structureSchema } from "@b/utils/constants";
import {
  userAvatarSchema,
  userFullNameSchema,
} from "@b/utils/schema/structure";
import { CacheManager } from "@b/utils/cache";

export const metadata = {
  summary: "Get form structure for AI Investments",
  operationId: "getAIInvestmentStructure",
  tags: ["Admin", "AI Investments"],
  responses: {
    200: {
      description: "Form structure for managing AI Investments",
      content: structureSchema,
    },
  },
  permission: "Access AI Investment Management",
};

export const aiInvestmentStructure = async () => {
  const plans = await models.aiInvestmentPlan.findAll();
  const durations = await models.aiInvestmentDuration.findAll();

  const userId = {
    type: "input",
    label: "User",
    name: "userId",
    placeholder: "Enter the user ID",
    icon: "lets-icons:user-duotone",
  };

  const planId = {
    type: "select",
    label: "Investment Plan",
    name: "planId",
    options: plans.map((plan) => ({
      value: plan.id,
      label: plan.title,
    })),
    placeholder: "Select an investment plan",
  };

  const durationId = {
    type: "select",
    label: "Duration",
    name: "durationId",
    options: durations.map((duration) => ({
      value: duration.id,
      label: duration.duration + " " + duration.timeframe,
    })),
    placeholder: "Select a duration",
  };

  const symbol = {
    type: "input",
    label: "Market",
    name: "symbol",
    placeholder: "Enter the symbol",
  };

  const amount = {
    type: "input",
    label: "Investment Amount",
    name: "amount",
    placeholder: "Enter the amount",
    ts: "number",
  };

  const profit = {
    type: "input",
    label: "Profit",
    name: "profit",
    placeholder: "Enter the profit",
    ts: "number",
    nullable: true,
  };

  const result = {
    type: "select",
    label: "Result",
    name: "result",
    options: [
      { value: "WIN", label: "Win" },
      { value: "LOSS", label: "Loss" },
      { value: "DRAW", label: "Draw" },
    ],
    placeholder: "Select a result",
    nullable: true,
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    options: [
      { value: "ACTIVE", label: "Active" },
      { value: "COMPLETED", label: "Completed" },
      { value: "CANCELLED", label: "Cancelled" },
      { value: "REJECTED", label: "Rejected" },
    ],
    placeholder: "Select status",
  };

  const type = {
    type: "select",
    label: "Wallet Type",
    name: "type",
    options: [{ value: "SPOT", label: "Spot" }],
    placeholder: "Select a wallet type",
  };
  const cacheManager = CacheManager.getInstance();
  const extensions = await cacheManager.getExtensions();
  if (extensions.has("ecosystem")) {
    type.options.push({ value: "ECO", label: "Funding" });
  }

  return {
    userId,
    planId,
    durationId,
    symbol,
    amount,
    profit,
    result,
    status,
    type,
  };
};

export default async (): Promise<object> => {
  const {
    userId,
    planId,
    durationId,
    symbol,
    amount,
    profit,
    result,
    status,
    type,
  } = await aiInvestmentStructure();

  return {
    get: [
      {
        fields: [
          userAvatarSchema,
          {
            fields: [
              userFullNameSchema,
              {
                type: "input",
                component: "InfoBlock",
                label: "Plan Title",
                name: "plan.title",
                icon: "ph:wallet-light",
              },
              {
                type: "input",
                component: "InfoBlock",
                label: "Duration",
                name: "duration.duration,' ',duration.timeframe",
                icon: "ph:currency-circle-dollar-light",
              },
            ],
            grid: "column",
          },
        ],
        className: "card-dashed mb-5 items-center",
      },
      symbol,
      [amount, profit],
      result,
      [type, status],
    ],
    set: [
      [userId, symbol],
      durationId,
      [planId, amount],
      [profit, result],
      [type, status],
    ],
  };
};
