// /api/stakingPools/structure.get.ts

import { structureSchema } from "@b/utils/constants";
import { CacheManager } from "@b/utils/cache";
import { models } from "@b/db";
import { getCurrencyConditions } from "@b/utils/currency";

export const metadata = {
  summary: "Get form structure for Staking Pools",
  operationId: "getStakingPoolStructure",
  tags: ["Admin", "Staking Pools"],
  responses: {
    200: {
      description: "Form structure for managing Staking Pools",
      content: structureSchema,
    },
  },
  permission: "Access Staking Pool Management",
};

export const stakingPoolStructure = async () => {
  const name = {
    type: "input",
    label: "Name",
    name: "name",
    component: "InfoBlock",
    icon: "material-symbols-light:title",
    placeholder: "Enter the pool name",
  };

  const description = {
    type: "textarea",
    label: "Description",
    name: "description",
    placeholder: "Enter the pool description",
  };

  const type = {
    type: "select",
    label: "Wallet Type",
    name: "type",
    options: [
      { value: "FIAT", label: "Fiat" },
      { value: "SPOT", label: "Spot" },
    ],
    placeholder: "Select wallet type",
  };

  const currencyConditions = await getCurrencyConditions();
  const cacheManager = CacheManager.getInstance();
  const extensions = await cacheManager.getExtensions();
  if (extensions.has("ecosystem")) {
    type.options.push({ value: "ECO", label: "Funding" });
  }

  const currency = {
    type: "select",
    label: "Currency",
    name: "currency",
    options: [],
    conditions: {
      type: currencyConditions,
    },
  };

  const chain = {
    type: "input",
    label: "Chain",
    name: "chain",
    placeholder: "Enter the blockchain chain, e.g. ETH, BSC",
    condition: { walletType: "ECO" },
  };

  const minStake = {
    type: "input",
    label: "Minimum Stake",
    name: "minStake",
    placeholder: "Enter the minimum staking amount",
    ts: "number",
  };

  const maxStake = {
    type: "input",
    label: "Maximum Stake",
    name: "maxStake",
    placeholder: "Enter the maximum staking amount",
    ts: "number",
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    options: [
      { value: "ACTIVE", label: "Active" },
      { value: "INACTIVE", label: "Inactive" },
      { value: "COMPLETED", label: "Completed" },
    ],
    placeholder: "Select the pool status",
  };

  const icon = {
    type: "file",
    label: "Icon",
    name: "icon",
    fileType: "avatar",
    width: 64,
    height: 64,
    maxSize: 1,
    className: "rounded-full",
    placeholder: "/img/placeholder.svg",
  };

  return {
    name,
    description,
    currency,
    chain,
    type,
    minStake,
    maxStake,
    status,
    icon,
  };
};

export default async () => {
  const {
    name,
    description,
    currency,
    chain,
    type,
    minStake,
    maxStake,
    status,
    icon,
  } = await stakingPoolStructure();

  return {
    get: [
      {
        fields: [
          icon,
          {
            fields: [name],
            grid: "column",
          },
        ],
        className: "card-dashed mb-3 items-center",
      },
      type,
      [currency, chain],
      [minStake, maxStake],
      description,
      status,
    ],
    set: [
      icon,
      [name, status],
      description,
      [type, currency, chain],
      [minStake, maxStake],
    ],
  };
};
