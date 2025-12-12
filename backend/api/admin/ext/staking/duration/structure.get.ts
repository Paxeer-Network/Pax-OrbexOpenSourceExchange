// /api/stakingDurations/structure.get.ts

import { models } from "@b/db";
import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for Staking Durations",
  operationId: "getStakingDurationStructure",
  tags: ["Admin","Staking Durations"],
  responses: {
    200: {
      description: "Form structure for managing Staking Durations",
      content: structureSchema,
    },
  },
  permission: "Access Staking Duration Management"
};

export const stakingDurationStructure = async () => {
  const pools = await models.stakingPool.findAll();
  const poolId = {
    type: "select",
    label: "Pool",
    name: "poolId",
    options: pools.map((pool) => ({
      value: pool.id,
      label: pool.name,
    })),
    placeholder: "Select the pool",
  };

  const duration = {
    type: "input",
    label: "Duration",
    name: "duration",
    placeholder: "Enter the duration in days",
    ts: "number",
  };

  const interestRate = {
    type: "input",
    label: "Interest Rate",
    name: "interestRate",
    placeholder: "Enter the interest rate (in %)",
    ts: "number",
  };

  return {
    poolId,
    duration,
    interestRate,
  };
};

export default async () => {
  const { poolId, duration, interestRate } = await stakingDurationStructure();

  return {
    get: [poolId, duration, interestRate],
    set: [poolId, [duration, interestRate]],
  };
};
