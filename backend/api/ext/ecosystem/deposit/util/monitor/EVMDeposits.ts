// EVMDeposits.ts
import { IDepositMonitor } from "./IDepositMonitor";
import { getEcosystemToken } from "@b/utils/eco/tokens";
import { fetchEcosystemTransactions } from "@b/utils/eco/transactions";
import { chainConfigs } from "@b/utils/eco/chains";
import {
  initializeWebSocketProvider,
  initializeHttpProvider,
  chainProviders,
} from "../ProviderManager";
import { ethers } from "ethers";
import { processTransaction, createTransactionDetails } from "../DepositUtils";
import { storeAndBroadcastTransaction } from "@b/utils/eco/redis/deposit";

interface EVMOptions {
  wallet: walletAttributes;
  chain: string;
  currency: string;
  address: string;
  contractType: "PERMIT" | "NO_PERMIT" | "NATIVE";
}

export class EVMDeposits implements IDepositMonitor {
  private wallet: walletAttributes;
  private chain: string;
  private currency: string;
  private address: string;
  private contractType: "PERMIT" | "NO_PERMIT" | "NATIVE";

  // Store provider, filter and listener for token deposits
  private provider: any;
  private tokenFilter: any;
  private tokenEventListener: ((log: any) => Promise<void>) | null = null;

  // Interval IDs to track polling tasks (for native and token deposits)
  private nativeCleanupIntervalId: number | null = null;
  private nativeVerifyIntervalId: number | null = null;
  private tokenCleanupIntervalId: number | null = null;

  constructor(options: EVMOptions) {
    this.wallet = options.wallet;
    this.chain = options.chain;
    this.currency = options.currency;
    this.address = options.address;
    this.contractType = options.contractType;
  }

  public async watchDeposits(): Promise<void> {
    let provider = chainProviders.get(this.chain);

    if (!provider) {
      provider = await initializeWebSocketProvider(this.chain);
      if (!provider) {
        provider = await initializeHttpProvider(this.chain);
      }
      if (!provider) return;
    }
    // Store provider reference for later cleanup
    this.provider = provider;

    const feeDecimals = chainConfigs[this.chain].decimals;

    if (this.contractType === "NATIVE") {
      await this.watchNativeDeposits(provider, feeDecimals);
    } else {
      await this.watchTokenDeposits(provider, feeDecimals);
    }
  }

  private async watchNativeDeposits(provider: any, feeDecimals: number) {
    const decimals = chainConfigs[this.chain].decimals;
    let lastChecked = Math.floor(Date.now() / 1000);

    // Map to track processed native deposits: txHash => timestamp (ms)
    const processedNativeTxs: Map<string, number> = new Map();
    const PROCESSING_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

    // Cleanup function to remove expired tx entries
    const cleanupProcessedNativeTxs = () => {
      const now = Date.now();
      for (const [txHash, timestamp] of processedNativeTxs.entries()) {
        if (now - timestamp > PROCESSING_EXPIRY_MS) {
          processedNativeTxs.delete(txHash);
        }
      }
    };
    // Save the interval ID so we can clear it later
    this.nativeCleanupIntervalId = setInterval(
      cleanupProcessedNativeTxs,
      60 * 1000
    );

    const verifyDeposits = async () => {
      const transactions = await fetchEcosystemTransactions(
        this.chain,
        this.address
      );
      for (const tx of transactions) {
        if (
          tx.to &&
          tx.to.toLowerCase() === this.address.toLowerCase() &&
          Number(tx.timestamp) > lastChecked &&
          Number(tx.status) === 1 &&
          !processedNativeTxs.has(tx.hash)
        ) {
          try {
            const txDetails = await createTransactionDetails(
              "NATIVE",
              this.wallet.id,
              tx,
              this.address,
              this.chain,
              decimals,
              feeDecimals,
              "DEPOSIT"
            );
            await storeAndBroadcastTransaction(txDetails, tx.hash);
            processedNativeTxs.set(tx.hash, Date.now());
            console.log(`Processed native deposit ${tx.hash}`);
          } catch (error) {
            console.error(
              `Error processing native transaction: ${(error as Error).message}`
            );
          }
        }
      }
      lastChecked = Math.floor(Date.now() / 1000);
    };

    // Initial check then poll every 10 seconds
    await verifyDeposits();
    this.nativeVerifyIntervalId = setInterval(verifyDeposits, 10000);
  }

  private async watchTokenDeposits(provider: any, feeDecimals: number) {
    const token = await getEcosystemToken(this.chain, this.currency);
    if (!token) {
      console.error(`Token ${this.currency} not found`);
      return;
    }

    const decimals = token.decimals;
    // Setup the event filter for token transfers to our address
    this.tokenFilter = {
      address: token.contract,
      topics: [
        ethers.id("Transfer(address,address,uint256)"),
        null,
        this.address ? ethers.zeroPadValue(this.address, 32) : undefined,
      ],
    };

    // Map to track processed token deposits: txHash => timestamp (ms)
    const processedTokenTxs: Map<string, number> = new Map();
    const PROCESSING_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

    const cleanupProcessedTokenTxs = () => {
      const now = Date.now();
      for (const [txHash, timestamp] of processedTokenTxs.entries()) {
        if (now - timestamp > PROCESSING_EXPIRY_MS) {
          processedTokenTxs.delete(txHash);
        }
      }
    };
    // Save interval ID for cleanup of processed token txs
    this.tokenCleanupIntervalId = setInterval(
      cleanupProcessedTokenTxs,
      60 * 1000
    );

    // Define and store the event listener for token transfers
    this.tokenEventListener = async (log) => {
      if (processedTokenTxs.has(log.transactionHash)) {
        return;
      }
      try {
        const success = await processTransaction(
          this.contractType,
          log.transactionHash,
          provider,
          this.address,
          this.chain,
          decimals,
          feeDecimals,
          this.wallet.id
        );
        if (success) {
          processedTokenTxs.set(log.transactionHash, Date.now());
          console.log(`Processed token deposit ${log.transactionHash}`);
        }
      } catch (error) {
        console.error(
          `Error in token deposit handler: ${(error as Error).message}`
        );
      }
    };

    provider.on(this.tokenFilter, this.tokenEventListener);

    provider.on("error", (error) => {
      console.error(`Provider error: ${JSON.stringify(error)}`);
    });
  }

  // Extended stopPolling method to remove event listeners and clear intervals
  public stopPolling() {
    // Remove token deposit event listener if it exists
    if (this.provider && this.tokenEventListener && this.tokenFilter) {
      this.provider.off(this.tokenFilter, this.tokenEventListener);
      console.info(
        `Removed token deposit event listener for wallet ${this.address}`
      );
      this.tokenEventListener = null;
    }
    // Clear native deposit intervals
    if (this.nativeCleanupIntervalId) {
      clearInterval(this.nativeCleanupIntervalId);
      this.nativeCleanupIntervalId = null;
    }
    if (this.nativeVerifyIntervalId) {
      clearInterval(this.nativeVerifyIntervalId);
      this.nativeVerifyIntervalId = null;
    }
    // Clear token cleanup interval
    if (this.tokenCleanupIntervalId) {
      clearInterval(this.tokenCleanupIntervalId);
      this.tokenCleanupIntervalId = null;
    }
    console.info(`Stopped polling for wallet ${this.address}`);
  }
}
