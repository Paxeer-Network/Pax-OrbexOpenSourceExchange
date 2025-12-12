import {
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import {
  baseEcosystemMasterWalletSchema,
  updateMasterWalletBalance,
} from "../utils";
import { models } from "@b/db";
import { getProvider } from "@b/utils/eco/provider";
import { fetchUTXOWalletBalance } from "@b/utils/eco/utxo";
import { ethers } from "ethers";
import { chainConfigs } from "@b/utils/eco/chains";
import SolanaService from "@b/blockchains/sol";
import TronService from "@b/blockchains/tron";
import MoneroService from "@b/blockchains/xmr";
import TonService from "@b/blockchains/ton";

export const metadata: OperationObject = {
  summary:
    "Retrieves detailed information of a specific ecosystem master wallet by ID",
  operationId: "getEcosystemMasterWalletById",
  tags: ["Admin", "Ecosystem Master Wallets"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the ecosystem master wallet to retrieve",
      schema: { type: "string" },
    },
  ],
  responses: {
    200: {
      description: "Ecosystem master wallet details",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: baseEcosystemMasterWalletSchema, // Define this schema in your utils if it's not already defined
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Ecosystem Master Wallet"),
    500: serverErrorResponse,
  },
  permission: "Access Ecosystem Master Wallet Management",
  requiresAuth: true,
};

export default async (data) => {
  const { params } = data;

  const wallet = await models.ecosystemMasterWallet.findByPk(params.id, {
    include: [
      {
        model: models.ecosystemCustodialWallet,
        as: "ecosystemCustodialWallets",
        attributes: ["id", "address", "status"],
      },
    ],
  });
  if (!wallet) {
    throw new Error(`Ecosystem master wallet not found: ${params.id}`);
  }
  await getWalletBalance(wallet);

  const updatedWallet = await models.ecosystemMasterWallet.findByPk(params.id, {
    include: [
      {
        model: models.ecosystemCustodialWallet,
        as: "ecosystemCustodialWallets",
        attributes: ["id", "address", "status"],
      },
    ],
  });

  if (!updatedWallet) {
    throw new Error(`Ecosystem master wallet not found: ${params.id}`);
  }

  return updatedWallet.get({ plain: true });
};

const getWalletBalance = async (
  wallet: ecosystemMasterWalletAttributes
): Promise<void> => {
  try {
    let formattedBalance;
    if (wallet.chain === "SOL") {
      const solanaService = await SolanaService.getInstance();
      formattedBalance = await solanaService.getBalance(wallet.address);
    } else if (wallet.chain === "TRON") {
      const tronService = await TronService.getInstance();
      formattedBalance = await tronService.getBalance(wallet.address);
    } else if (wallet.chain === "XMR") {
      const moneroService = await MoneroService.getInstance();
      formattedBalance = await moneroService.getBalance("master_wallet");
    } else if (wallet.chain === "TON") {
      const tonService = await TonService.getInstance();
      formattedBalance = await tonService.getBalance(wallet.address);
    } else if (["BTC", "LTC", "DOGE", "DASH"].includes(wallet.chain)) {
      formattedBalance = await fetchUTXOWalletBalance(
        wallet.chain,
        wallet.address
      );
    } else {
      const provider = await getProvider(wallet.chain);
      const balance = await provider.getBalance(wallet.address);
      const decimals = chainConfigs[wallet.chain].decimals;
      formattedBalance = ethers.formatUnits(balance.toString(), decimals);
    }

    if (!formattedBalance || isNaN(parseFloat(formattedBalance))) {
      console.error(
        `Invalid formatted balance for ${wallet.chain} wallet: ${formattedBalance}`
      );
      return;
    }

    if (parseFloat(formattedBalance) === 0) {
      return;
    }

    await updateMasterWalletBalance(wallet.id, parseFloat(formattedBalance));
  } catch (error) {
    console.error(
      `Failed to fetch ${wallet.chain} wallet balance: ${error.message}`
    );
  }
};
