// DepositUtils.ts

import { ethers } from "ethers";
import { storeAndBroadcastTransaction } from "@b/utils/eco/redis/deposit";
import { decodeTransactionData } from "@b/utils/eco/blockchain";

/**
 * Decodes and validates a transaction, ensures `to` matches our target address.
 * Returns null if conditions fail.
 */
export async function processTransaction(
  contractType: "PERMIT" | "NO_PERMIT" | "NATIVE",
  txHash: string,
  provider: ethers.JsonRpcProvider | ethers.WebSocketProvider,
  address: string,
  chain: string,
  decimals: number,
  feeDecimals: number,
  walletId: string
): Promise<boolean> {
  try {
    const tx = await provider.getTransaction(txHash);
    if (!tx || !tx.data) return false;

    const decodedData = decodeTransactionData(tx.data);
    const realTo = decodedData.to || tx.to;
    const amount = decodedData.amount || tx.value;

    if (!realTo || !address) {
      console.error(
        `Invalid transaction data: realTo=${realTo}, address=${address}`
      );
      return false;
    }

    if (realTo.toLowerCase() !== address.toLowerCase()) return false;

    const txDetails = await createTransactionDetails(
      contractType,
      walletId,
      tx,
      realTo,
      chain,
      decimals,
      feeDecimals,
      "DEPOSIT",
      amount
    );

    await storeAndBroadcastTransaction(txDetails, txHash);
    return true;
  } catch (error) {
    console.error(
      `Error processing transaction: ${(error as Error).message}, TxHash: ${txHash}`
    );
    return false;
  }
}

export async function createTransactionDetails(
  contractType: "PERMIT" | "NO_PERMIT" | "NATIVE",
  walletId: string,
  tx: any,
  toAddress: string,
  chain: string,
  decimals: number,
  feeDecimals: number,
  type: string,
  amount = tx.amount
) {
  const formattedAmount = ethers.formatUnits(amount.toString(), decimals);
  const formattedGasLimit = tx.gasLimit ? tx.gasLimit.toString() : "N/A";
  const formattedGasPrice = tx.gasPrice
    ? ethers.formatUnits(tx.gasPrice.toString(), feeDecimals)
    : "N/A";

  return {
    contractType,
    id: walletId,
    chain,
    hash: tx.hash,
    type,
    from: tx.from,
    to: toAddress,
    amount: formattedAmount,
    gasLimit: formattedGasLimit,
    gasPrice: formattedGasPrice,
  };
}
