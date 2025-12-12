// /api/mlmReferralConditions/structure.get.ts

import { CacheManager } from "@b/utils/cache";
import { structureSchema } from "@b/utils/constants";
import { getCurrencyConditions } from "@b/utils/currency";

export const metadata = {
  summary: "Get form structure for MLM Referral Conditions",
  operationId: "getMlmReferralConditionStructure",
  tags: ["Admin", "MLM Referral Conditions"],
  responses: {
    200: {
      description: "Form structure for managing MLM Referral Conditions",
      content: structureSchema,
    },
  },
  permission: "Access MLM Referral Condition Management",
};

export const mlmReferralConditionStructure = async () => {
  const title = {
    type: "input",
    label: "Title",
    name: "title",
    placeholder: "Enter the title for this condition",
    required: true,
    icon: "material-symbols-light:title",
  };

  const description = {
    type: "textarea",
    label: "Description",
    name: "description",
    placeholder: "Describe the condition details",
    required: true,
  };

  const reward = {
    type: "input",
    label: "Reward",
    name: "reward",
    placeholder: "Enter the reward amount",
    required: true,
    icon: "marketeq:reward",
    ts: "number",
  };

  const rewardType = {
    type: "select",
    label: "Reward Type",
    name: "rewardType",
    options: [
      { value: "PERCENTAGE", label: "Percentage" },
      { value: "FIXED", label: "Fixed" },
    ],
    placeholder: "Select the reward type",
    required: true,
    icon: "bx:bxs-coin-stack",
  };

  const rewardWalletType = {
    type: "select",
    label: "Reward Wallet Type",
    name: "rewardWalletType",
    options: [
      { value: "FIAT", label: "Fiat" },
      { value: "SPOT", label: "Spot" },
    ],
    icon: "solar:wallet-bold-duotone",
    placeholder: "Select the wallet type for reward",
  };

  const currencyConditions = await getCurrencyConditions();

  // Use CacheManager to retrieve extensions

  const cacheManager = CacheManager.getInstance();
  const extensions = await cacheManager.getExtensions();
  if (extensions.has["ecosystem"]) {
    rewardWalletType.options.push({ value: "ECO", label: "Funding" });
  }

  const rewardCurrency = {
    type: "select",
    label: "Reward Currency",
    name: "rewardCurrency",
    placeholder: "Enter the currency for reward",
    icon: "ph:currency-eth-thin",
    options: [],
    conditions: {
      rewardWalletType: currencyConditions,
    },
  };

  const image = {
    type: "file",
    label: "Image",
    name: "image",
    fileType: "image",
    width: 1024,
    height: 1792,
    maxSize: 1,
    placeholder: "/img/placeholder.svg",
  };

  return {
    title,
    description,
    reward,
    rewardType,
    rewardWalletType,
    rewardCurrency,
    image,
  };
};

export default async () => {
  const {
    title,
    description,
    reward,
    rewardType,
    rewardWalletType,
    rewardCurrency,
    image,
  } = await mlmReferralConditionStructure();

  return {
    get: [
      title,
      description,
      reward,
      rewardType,
      rewardWalletType,
      rewardCurrency,
    ],
    set: [
      image,
      title,
      description,
      [reward, rewardType],
      [rewardWalletType, rewardCurrency],
    ],
  };
};
