// /api/admin/ecosystemCustodialWallets/structure.get.ts

import { structureSchema } from "@b/utils/constants";
import { models } from "@b/db";
import { Op } from "sequelize";

export const metadata = {
  summary: "Get form structure for Ecosystem Custodial Wallets",
  operationId: "getEcosystemCustodialWalletStructure",
  tags: ["Admin", "Ecosystem Custodial Wallets"],
  responses: {
    200: {
      description: "Form structure for managing Ecosystem Custodial Wallets",
      content: structureSchema,
    },
  },
  permission: "Access Ecosystem Custodial Wallet Management",
};

export const ecosystemCustodialWalletStructure = async () => {
  // except chain : SOL, TRON
  const masterWallets = await models.ecosystemMasterWallet.findAll({
    where: {
      chain: {
        [Op.notIn]: [
          "SOL",
          "TRON",
          "BTC",
          "LTC",
          "DOGE",
          "DASH",
          "XMR",
          "TON",
          "MO",
        ],
      },
    },
  });

  const masterWalletId = {
    type: "select",
    label: "Master Wallet",
    name: "masterWalletId",
    options: masterWallets.map((wallet) => ({
      value: wallet.id,
      label: wallet.chain,
    })),
    placeholder: "Select the master wallet",
  };

  const address = {
    type: "input",
    label: "Wallet Address",
    name: "address",
    placeholder: "Enter the wallet address",
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    options: [
      { value: "ACTIVE", label: "Active" },
      { value: "INACTIVE", label: "Inactive" },
      { value: "SUSPENDED", label: "Suspended" },
    ],
    placeholder: "Select the status of the wallet",
  };

  return {
    masterWalletId,
    address,
    status,
  };
};

export default async (): Promise<object> => {
  const { masterWalletId, address, status } =
    await ecosystemCustodialWalletStructure();

  return {
    get: [masterWalletId, address, status],
    set: [masterWalletId],
    edit: [status],
  };
};
