// /api/admin/ecosystemPrivateLedgers/structure.get.ts

import { structureSchema } from "@b/utils/constants";
import { models } from "@b/db";

export const metadata = {
  summary: "Get form structure for Ecosystem Private Ledgers",
  operationId: "getEcosystemPrivateLedgerStructure",
  tags: ["Admin", "Ecosystem Private Ledgers"],
  responses: {
    200: {
      description: "Form structure for managing Ecosystem Private Ledgers",
      content: structureSchema,
    },
  },
  permission: "Access Ecosystem Private Ledger Management",
};

export const ecosystemPrivateLedgerStructure = async () => {
  const wallets = await models.wallet.findAll();

  const walletId = {
    type: "select",
    label: "Wallet",
    name: "walletId",
    options: wallets.map((wallet) => ({
      value: wallet.id,
      label: wallet.currency,
    })),
    placeholder: "Select the associated wallet",
  };

  const index = {
    type: "input",
    label: "Index",
    name: "index",
    placeholder: "Enter the ledger index",
    ts: "number",
  };

  const currency = {
    type: "input",
    label: "Currency",
    name: "currency",
    placeholder: "Enter the currency (e.g., USD, BTC)",
  };

  const chain = {
    type: "input",
    label: "Chain",
    name: "chain",
    placeholder: "Enter the blockchain chain (e.g., Ethereum, Bitcoin)",
  };

  const network = {
    type: "input",
    label: "Network",
    name: "network",
    placeholder: "Enter the network (e.g., mainnet, testnet)",
  };

  const offchainDifference = {
    type: "input",
    label: "Offchain Difference",
    name: "offchainDifference",
    placeholder: "Enter the offchain difference amount",
    ts: "number",
  };

  return {
    walletId,
    index,
    currency,
    chain,
    network,
    offchainDifference,
  };
};

export default async (): Promise<Record<string, any>> => {
  const { walletId, index, currency, chain, network, offchainDifference } =
    await ecosystemPrivateLedgerStructure();

  return {
    get: [walletId, index, currency, chain, network, offchainDifference],
    set: [walletId, index, currency, chain, network, offchainDifference],
  };
};
