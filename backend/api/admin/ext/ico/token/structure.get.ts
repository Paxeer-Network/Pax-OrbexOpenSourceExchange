// /api/icoTokens/structure.get.ts

import { models } from "@b/db";
import { structureSchema } from "@b/utils/constants";
import { imageStructure } from "@b/utils/schema/structure";
import { CacheManager } from "@b/utils/cache";
import { getCurrencyConditions } from "@b/utils/currency";

export const metadata = {
  summary: "Get form structure for ICO Tokens",
  operationId: "getIcoTokenStructure",
  tags: ["Admin", "ICO Tokens"],
  responses: {
    200: {
      description: "Form structure for managing ICO Tokens",
      content: structureSchema,
    },
  },
  permission: "Access ICO Token Management",
};

export const icoTokenStructure = async () => {
  const projects = await models.icoProject.findAll();

  const name = {
    type: "input",
    label: "Name",
    name: "name",
    component: "InfoBlock",
    icon: "material-symbols-light:title",
    placeholder: "Enter the token name",
  };

  const chain = {
    type: "input",
    label: "Blockchain Chain",
    name: "chain",
    component: "InfoBlock",
    placeholder:
      "Enter the blockchain chain (e.g., Ethereum, Binance Smart Chain)",
  };

  const currency = {
    type: "input",
    label: "Currency",
    name: "currency",
    component: "InfoBlock",
    placeholder: "Enter the native currency (e.g., ETH, BNB)",
  };

  const purchaseWalletType = {
    type: "select",
    label: "Wallet Type for Purchase",
    name: "purchaseWalletType",
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
    purchaseWalletType.options.push({ value: "ECO", label: "Funding" });
  }

  const purchaseCurrency = {
    type: "select",
    label: "Purchase Currency",
    name: "purchaseCurrency",
    placeholder: "Enter the purchase currency",
    options: [],
    conditions: {
      purchaseWalletType: currencyConditions,
    },
  };

  const address = {
    type: "input",
    label: "Token Contract Address",
    name: "address",
    placeholder: "Enter the token contract address",
  };

  const totalSupply = {
    type: "input",
    label: "Total Supply",
    name: "totalSupply",
    placeholder: "Enter the total supply of tokens",
    ts: "number",
  };

  const description = {
    type: "textarea",
    label: "Description",
    name: "description",
    placeholder: "Enter the token description",
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    options: [
      { value: "PENDING", label: "Pending" },
      { value: "ACTIVE", label: "Active" },
      { value: "COMPLETED", label: "Completed" },
      { value: "REJECTED", label: "Rejected" },
      { value: "CANCELLED", label: "Cancelled" },
    ],
    placeholder: "Select the token status",
  };

  const projectId = {
    type: "select",
    label: "Project",
    name: "projectId",
    options: projects.map((project) => ({
      value: project.id,
      label: project.name,
    })),
    placeholder: "Select the project",
  };

  return {
    name,
    chain,
    currency,
    purchaseCurrency,
    purchaseWalletType,
    address,
    totalSupply,
    description,
    status,
    projectId,
  };
};

export default async (): Promise<object> => {
  const {
    name,
    chain,
    currency,
    purchaseCurrency,
    purchaseWalletType,
    address,
    totalSupply,
    description,
    status,
    projectId,
  } = await icoTokenStructure();

  return {
    get: [
      {
        fields: [
          {
            ...imageStructure,
            width: imageStructure.width / 4,
            height: imageStructure.width / 4,
          },
          {
            fields: [
              name,
              {
                type: "input",
                component: "InfoBlock",
                label: "Plan Title",
                name: "project.name",
                icon: "ph:wallet-light",
              },
              chain,
              currency,
            ],
            grid: "column",
          },
        ],
        className: "card-dashed mb-3 items-center",
      },
      [purchaseWalletType, purchaseCurrency],
      address,
      totalSupply,
      description,
      status,
    ],
    set: [
      imageStructure,
      [name, projectId],
      [chain, currency],
      [purchaseWalletType, purchaseCurrency],
      [address, totalSupply],
      description,
      status,
    ],
  };
};
