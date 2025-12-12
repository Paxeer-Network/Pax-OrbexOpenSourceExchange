// PendingVerification.ts
import { loadFromRedis, offloadToRedis } from "@b/utils/eco/redis/deposit";
import { handleEcosystemDeposit } from "@b/utils/eco/wallet";
import { hasClients, sendMessageToRoute } from "@b/handler/Websocket";
import { verifyUTXOTransaction } from "@b/utils/eco/utxo";
import { handleNotification } from "@b/utils/notifications";
import { unlockAddress } from "../../wallet/utils";
import {
  chainProviders,
  initializeHttpProvider,
  initializeWebSocketProvider,
} from "./ProviderManager";

export async function verifyPendingTransactions() {
  if (!hasClients(`/api/ext/ecosystem/deposit`)) {
    return;
  }

  const processingTransactions = new Set();

  try {
    const pendingTransactions = await loadFromRedis("pendingTransactions");

    if (!pendingTransactions || Object.keys(pendingTransactions).length === 0) {
      return;
    }

    const txHashes = Object.keys(pendingTransactions);

    // Limit concurrency for large batch of txs
    const concurrency = 5;
    const chunks: string[][] = [];
    for (let i = 0; i < txHashes.length; i += concurrency) {
      chunks.push(txHashes.slice(i, i + concurrency));
    }

    for (const chunk of chunks) {
      const verificationPromises = chunk.map(async (txHash) => {
        if (processingTransactions.has(txHash)) {
          console.log(`Transaction ${txHash} already being processed.`);
          return;
        }

        try {
          const txDetails = pendingTransactions[txHash];
          if (!txDetails) {
            console.error(`Transaction ${txHash} not found in pending list.`);
            return;
          }

          processingTransactions.add(txHash);
          const chain = txDetails.chain;

          let isConfirmed = false;
          let updatedTxDetails: any = null;

          if (["SOL", "TRON", "XMR", "TON"].includes(chain)) {
            isConfirmed =
              txDetails.status === "COMPLETED" ||
              txDetails.status === "CONFIRMED";
            updatedTxDetails = txDetails;
          } else if (["BTC", "LTC", "DOGE", "DASH"].includes(chain)) {
            // UTXO chain verification
            const data = await verifyUTXOTransaction(chain, txHash);
            isConfirmed = data.confirmed;
            updatedTxDetails = {
              ...txDetails,
              status: isConfirmed ? "COMPLETED" : "PENDING",
            };
          } else {
            // EVM-compatible chain verification
            let provider = chainProviders.get(chain);
            if (!provider) {
              provider = await initializeWebSocketProvider(chain);
              if (!provider) {
                provider = await initializeHttpProvider(chain);
              }
            }

            if (!provider) {
              console.error(`Provider not available for chain ${chain}`);
              return; // Keep pending
            }

            try {
              const receipt = await provider.getTransactionReceipt(txHash);
              if (!receipt) {
                console.log(`Transaction ${txHash} not yet confirmed.`);
                return; // Keep in pending state
              }

              isConfirmed = receipt.status === 1;
              updatedTxDetails = {
                ...txDetails,
                gasUsed: receipt.gasUsed.toString(),
                status: isConfirmed ? "COMPLETED" : "FAILED",
              };
            } catch (error) {
              console.error(
                `Error fetching receipt for ${txHash}: ${error.message}`
              );
              return; // Keep in pending state
            }
          }

          if (isConfirmed && updatedTxDetails) {
            try {
              const response = await handleEcosystemDeposit(updatedTxDetails);
              if (!response.transaction) {
                console.log(
                  `Transaction ${txHash} already processed or invalid. Removing.`
                );
                delete pendingTransactions[txHash];
                await offloadToRedis(
                  "pendingTransactions",
                  pendingTransactions
                );
                return;
              }

              const address =
                chain === "MO"
                  ? txDetails.to.toLowerCase()
                  : typeof txDetails.to === "string"
                    ? txDetails.to
                    : txDetails.address.toLowerCase();

              sendMessageToRoute(
                "/api/ext/ecosystem/deposit",
                {
                  currency: response.wallet?.currency,
                  chain,
                  address,
                },
                {
                  stream: "verification",
                  data: {
                    status: 200,
                    message: "Transaction completed",
                    ...response,
                    trx: updatedTxDetails,
                    balance: response.wallet?.balance,
                    currency: response.wallet?.currency,
                    chain,
                    method: "Wallet Deposit",
                  },
                }
              );

              if (txDetails.contractType === "NO_PERMIT") {
                unlockAddress(txDetails.to);
              }

              if (response.wallet?.userId) {
                await handleNotification({
                  userId: response.wallet.userId,
                  title: "Deposit Confirmation",
                  message: `Your deposit of ${updatedTxDetails?.amount} ${response.wallet.currency} has been confirmed`,
                  type: "ACTIVITY",
                });
              }

              delete pendingTransactions[txHash];
              await offloadToRedis("pendingTransactions", pendingTransactions);
            } catch (error) {
              console.error(
                `Error handling deposit for ${txHash}: ${error.message}`
              );
              if (error.message.includes("already processed")) {
                delete pendingTransactions[txHash];
                await offloadToRedis(
                  "pendingTransactions",
                  pendingTransactions
                );
              }
            }
          }
        } catch (error) {
          console.error(
            `Error verifying transaction ${txHash}: ${error.message}`
          );
        } finally {
          processingTransactions.delete(txHash);
        }
      });

      await Promise.all(verificationPromises);
    }
  } catch (error) {
    console.error(`Error in verifyPendingTransactions: ${error.message}`);
  }
}
