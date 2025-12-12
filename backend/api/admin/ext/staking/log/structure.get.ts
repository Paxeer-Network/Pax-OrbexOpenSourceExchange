// /api/stakingLogs/structure.get.ts

import { models } from "@b/db";
import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for Staking Logs",
  operationId: "getStakingLogStructure",
  tags: ["Admin","Staking Logs"],
  responses: {
    200: {
      description: "Form structure for managing Staking Logs",
      content: structureSchema,
    },
  },
  permission: "Access Staking Management"
};

export const stakingLogStructure = async () => {
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

  const durations = await models.stakingDuration.findAll();
  const durationId = {
    type: "select",
    label: "Duration",
    name: "durationId",
    options: durations.map((duration) => ({
      value: duration.id,
      label: `${duration.duration > 1 ? duration.duration + " days" : "1 day"}`,
    })),
    placeholder: "Select the duration",
  };

  const userId = {
    type: "input",
    label: "User",
    name: "userId",
    placeholder: "Enter the user ID",
    icon: "lets-icons:user-duotone",
  };

  const amount = {
    type: "input",
    label: "Amount",
    name: "amount",
    placeholder: "Enter the staked amount",
    ts: "number",
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    options: [
      { value: "ACTIVE", label: "Active" },
      { value: "RELEASED", label: "Released" },
      { value: "COLLECTED", label: "Collected" },
    ],
    placeholder: "Select the status",
  };

  return {
    userId,
    poolId,
    durationId,
    amount,
    status,
  };
};

export default async () => {
  const { userId, poolId, durationId, amount, status } =
    await stakingLogStructure();

  return {
    get: [userId, poolId, durationId, amount, status],
    set: [userId, [poolId, durationId], [amount, status]],
  };
};
