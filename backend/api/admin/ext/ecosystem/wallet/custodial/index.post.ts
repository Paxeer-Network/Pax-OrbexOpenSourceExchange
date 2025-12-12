// /api/admin/ecosystem/custodialWallets/store.post.ts
import { deployCustodialContract } from "../master/utils";
import { models } from "@b/db";
import { isError } from "ethers";

export const metadata: OperationObject = {
  summary: "Stores a new Ecosystem Custodial Wallet",
  operationId: "storeEcosystemCustodialWallet",
  tags: ["Admin", "Ecosystem Custodial Wallets"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            masterWalletId: {
              type: "string",
              description:
                "Master wallet ID associated with the custodial wallet",
            },
          },
          required: ["masterWalletId"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Ecosystem custodial wallet created successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Success message",
              },
            },
          },
        },
      },
    },
  },
  requiresAuth: true,
  permission: "Access Ecosystem Custodial Wallet Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { masterWalletId } = body;

  try {
    const wallet = await models.ecosystemMasterWallet.findByPk(masterWalletId);
    if (!wallet) {
      throw new Error(`Master wallet not found`);
    }

    const contractAddress = await deployCustodialContract(wallet);
    if (!contractAddress) {
      throw new Error("Failed to deploy custodial wallet contract");
    }

    await storeCustodialWallet(wallet.id, wallet.chain, contractAddress);

    return {
      message: "Ecosystem custodial wallet created successfully",
    };
  } catch (error) {
    if (isError(error, "INSUFFICIENT_FUNDS")) {
      // Handle insufficient funds
      console.error("Insufficient funds for transaction");
    }

    // General error logging
    console.error(
      `Failed to deploy custodial wallet contract: ${error.message}`
    );

    throw new Error(error.message);
  }
};

export async function storeCustodialWallet(
  walletId: string,
  chain: string,
  contractAddress: string
): Promise<ecosystemCustodialWalletAttributes> {
  return await models.ecosystemCustodialWallet.create({
    masterWalletId: walletId,
    address: contractAddress,
    network: process.env[`${chain}_NETWORK`],
    chain: chain,
    status: "ACTIVE",
  });
}
