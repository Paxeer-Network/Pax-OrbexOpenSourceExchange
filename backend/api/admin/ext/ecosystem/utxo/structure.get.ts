// /api/admin/ecosystemUtxos/structure.get.ts

import { structureSchema } from "@b/utils/constants";
import { models } from "@b/db";

export const metadata = {
  summary: "Get form structure for Ecosystem UTXOs",
  operationId: "getEcosystemUtxoStructure",
  tags: ["Admin", "Ecosystem UTXOs"],
  responses: {
    200: {
      description: "Form structure for managing Ecosystem UTXOs",
      content: structureSchema,
    },
  },
  permission: "Access Ecosystem UTXO Management",
};

export const ecosystemUtxoStructure = async () => {
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

  const transactionId = {
    type: "input",
    label: "Transaction ID",
    name: "transactionId",
    placeholder: "Enter the transaction ID",
  };

  const index = {
    type: "input",
    label: "Index",
    name: "index",
    placeholder: "Enter the output index in the transaction",
    ts: "number",
  };

  const amount = {
    type: "input",
    label: "Amount",
    name: "amount",
    placeholder: "Enter the amount of the UTXO",
    ts: "number",
  };

  const script = {
    type: "input",
    label: "Script",
    name: "script",
    placeholder: "Enter the script associated with the UTXO",
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

    placeholder: "Check if the UTXO is active",
  };

  return {
    walletId,
    transactionId,
    index,
    amount,
    script,
    status,
  };
};

export default async (): Promise<Record<string, any>> => {
  const { walletId, transactionId, index, amount, script, status } =
    await ecosystemUtxoStructure();

  return {
    get: [walletId, transactionId, [index, amount], script, status],
    set: [[walletId, transactionId], [index, amount], script, status],
  };
};
