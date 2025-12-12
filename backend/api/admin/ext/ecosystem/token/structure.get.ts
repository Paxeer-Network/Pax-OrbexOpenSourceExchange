// /api/admin/ecosystemTokens/structure.get.ts

import { models } from "@b/db";
import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for Ecosystem Tokens",
  operationId: "getEcosystemTokenStructure",
  tags: ["Admin", "Ecosystem Tokens"],
  responses: {
    200: {
      description: "Form structure for managing Ecosystem Tokens",
      content: structureSchema,
    },
  },
  permission: "Access Ecosystem Token Management",
};

export const ecosystemTokenStructure = async () => {
  const chains = await models.ecosystemBlockchain.findAll({
    where: { chain: ["SOL", "MO"] },
  });

  // Extract chain statuses
  const solanaBlockchain = chains.find((c) => c.chain === "SOL" && c.status);
  const moBlockchain = chains.find((c) => c.chain === "MO" && c.status);

  const contract = {
    type: "input",
    label: "Contract Address",
    name: "contract",
    placeholder: "Leave empty to deploy a new contract",
  };

  const name = {
    type: "input",
    label: "Token Name",
    name: "name",
    placeholder: "Enter the token name",
  };

  const currency = {
    type: "input",
    label: "Currency",
    name: "currency",
    placeholder: "Enter the currency symbol (e.g., ETH, BTC)",
  };

  const chain = {
    type: "select",
    label: "Chain",
    name: "chain",
    options: [
      { value: "ARBITRUM", label: "Arbitrum (ARB)" },
      { value: "BASE", label: "Base (BASE)" },
      { value: "BSC", label: "Binance Smart Chain (BSC)" },
      { value: "CELO", label: "Celo (CELO)" },
      { value: "ETH", label: "Ethereum (ETH)" },
      { value: "FTM", label: "Fantom (FTM)" },
      { value: "OPTIMISM", label: "Optimism (OVM)" },
      { value: "POLYGON", label: "Polygon (MATIC)" },
      { value: "RSK", label: "RSK (RSK)" },
      ...(solanaBlockchain ? [{ value: "SOL", label: "Solana (SOL)" }] : []),
      ...(moBlockchain ? [{ value: "MO", label: "Mo Chain (MO)" }] : []),
    ],
    placeholder: "Select the chain",
  };

  const network = {
    type: "select",
    label: "Network",
    name: "network",
    options: [
      { value: "mainnet", label: "Mainnet" },
      { value: "testnet", label: "Testnet" },
    ],
    placeholder: "Select the network",
  };

  const type = {
    type: "input",
    label: "Token Type",
    name: "type",
    placeholder: "Enter the token type (e.g., ERC-20, BEP-20)",
  };

  const decimals = {
    type: "input",
    label: "Decimals",
    name: "decimals",
    placeholder: "Enter the number of decimals",
    ts: "number",
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
    ts: "boolean",
  };

  const precision = {
    type: "input",
    label: "Precision",
    name: "precision",
    placeholder: "Enter the precision",
    ts: "number",
  };

  const icon = {
    type: "file",
    label: "Token Icon",
    name: "icon",
    fileType: "image",
    width: 64,
    height: 64,
    maxSize: 1,
    className: "rounded-full",
    placeholder: "/img/avatars/placeholder.webp",
  };

  const contractType = {
    type: "select",
    label: "Contract Type",
    name: "contractType",
    options: [
      { value: "PERMIT", label: "Permit" },
      { value: "NO_PERMIT", label: "No Permit" },
      { value: "NATIVE", label: "Native" },
    ],
    placeholder: "Select the contract type",
  };

  const limits = {
    label: "Limits",
    name: "limits",
    grid: "column",
    type: "object",
    ts: "object",
    fields: [
      [
        {
          type: "object",
          label: "Deposit",
          name: "deposit",
          fields: [
            [
              {
                type: "input",
                label: "Minimum",
                name: "min",
                placeholder: "Enter minimum deposit amount",
                ts: "number",
              },
              {
                type: "input",
                label: "Maximum",
                name: "max",
                placeholder: "Enter maximum deposit amount",
                ts: "number",
              },
            ],
          ],
        },
        {
          type: "object",
          label: "Withdraw",
          name: "withdraw",
          fields: [
            [
              {
                type: "input",
                label: "Minimum",
                name: "min",
                placeholder: "Enter minimum withdrawal amount",
                ts: "number",
              },
              {
                type: "input",
                label: "Maximum",
                name: "max",
                placeholder: "Enter maximum withdrawal amount",
                ts: "number",
              },
            ],
          ],
        },
      ],
    ],
  };

  const fee = {
    type: "object",
    label: "Fee",
    name: "fee",
    grid: "column",
    ts: "object",
    fields: [
      [
        {
          type: "input",
          label: "Minimum Fee",
          name: "min",
          placeholder: "Enter minimum withdrawal amount fee",
          ts: "number",
        },
        {
          type: "input",
          label: "Percentage Fee",
          name: "percentage",
          placeholder: "Enter percentage fee",
          ts: "number",
        },
      ],
    ],
  };

  const initialHolder = {
    type: "input",
    label: "Initial Holder",
    name: "initialHolder",
    placeholder: "Enter the initial holder address",
  };

  const initialSupply = {
    type: "input",
    label: "Initial Supply",
    name: "initialSupply",
    placeholder: "Enter the initial supply",
    ts: "number",
  };

  const marketCap = {
    type: "input",
    label: "Market Cap",
    name: "marketCap",
    placeholder: "Enter the market cap",
    ts: "number",
  };

  return {
    contract,
    name,
    currency,
    chain,
    network,
    type,
    decimals,
    status,
    precision,
    limits,
    fee,
    icon,
    contractType,
    initialHolder,
    initialSupply,
    marketCap,
  };
};

export default async (): Promise<object> => {
  const {
    contract,
    name,
    currency,
    chain,
    network,
    type,
    decimals,
    status,
    precision,
    limits,
    fee,
    icon,
    contractType,
    initialHolder,
    initialSupply,
    marketCap,
  } = await ecosystemTokenStructure();

  return {
    get: [
      icon,
      [name, currency],
      [chain, network],
      [contract, contractType],
      [decimals, precision],
      type,
      fee,
      limits,
      status,
    ],
    set: [
      icon,
      [name, currency],
      [chain, network],
      [decimals, precision],
      [initialHolder, initialSupply],
      marketCap,
      fee,
      limits,
      status,
    ],
    edit: [icon, fee, limits, status],
    import: [
      icon,
      [name, currency],
      [chain, network],
      [contract, contractType],
      [decimals, precision],
      type,
      fee,
      limits,
      status,
    ],
  };
};
