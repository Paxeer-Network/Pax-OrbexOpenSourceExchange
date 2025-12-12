// /api/admin/aiInvestmentDurations/structure.get.ts

import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for AI Investment Durations",
  operationId: "getAIInvestmentDurationStructure",
  tags: ["Admin", "AI Investment Durations"],
  responses: {
    200: {
      description: "Form structure for managing AI Investment Durations",
      content: structureSchema,
    },
  },
  permission: "Access AI Investment Duration Management",
};

export const aiInvestmentDurationStructure = () => {
  const id = {
    type: "input",
    label: "ID",
    name: "id",
    placeholder: "Automatically generated",
    readOnly: true,
  };

  const duration = {
    type: "input",
    label: "Duration",
    name: "duration",
    placeholder: "Enter the duration number",
    ts: "number",
  };

  const timeframe = {
    type: "select",
    label: "Timeframe",
    name: "timeframe",
    options: [
      { value: "HOUR", label: "Hour" },
      { value: "DAY", label: "Day" },
      { value: "WEEK", label: "Week" },
      { value: "MONTH", label: "Month" },
    ],
    placeholder: "Select a timeframe",
  };

  return {
    id,
    duration,
    timeframe,
  };
};

export default async (): Promise<object> => {
  const { id, duration, timeframe } = aiInvestmentDurationStructure();

  return {
    get: [duration, timeframe],
    set: [[duration, timeframe]],
  };
};
