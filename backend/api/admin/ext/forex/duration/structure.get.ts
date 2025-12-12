// /api/admin/forexDurations/structure.get.ts

import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for Forex Durations",
  operationId: "getForexDurationStructure",
  tags: ["Admin", "Forex Durations"],
  responses: {
    200: {
      description: "Form structure for managing Forex Durations",
      content: structureSchema,
    },
  },
  permission: "Access Forex Duration Management",
};

export const forexDurationStructure = () => {
  const duration = {
    type: "input",
    label: "Duration",
    name: "duration",
    placeholder: "Enter duration number",
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
    duration,
    timeframe,
  };
};

export default (): object => {
  const { duration, timeframe } = forexDurationStructure();

  return {
    get: [duration, timeframe],
    set: [[duration, timeframe]],
  };
};
