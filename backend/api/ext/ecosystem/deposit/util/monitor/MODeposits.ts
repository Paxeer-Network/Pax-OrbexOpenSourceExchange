// MODeposits.ts
import { IDepositMonitor } from "./IDepositMonitor";
import { ethers, JsonRpcProvider } from "ethers";
import { chainProviders, initializeHttpProvider } from "../ProviderManager";
import { getEcosystemToken } from "@b/utils/eco/tokens";
import { chainConfigs } from "@b/utils/eco/chains";
import { processTransaction } from "../DepositUtils";

interface MOOptions {
  wallet: walletAttributes;
  chain: string;
  currency: string;
  address: string;
  contractType: "PERMIT" | "NO_PERMIT";
}

export class MODeposits implements IDepositMonitor {
  private wallet: walletAttributes;
  private chain: string;
  private currency: string;
  private address: string;
  private contractType: "PERMIT" | "NO_PERMIT";
  private intervalId: number | null = null;
  private cleanupIntervalId: number | null = null;
  private pollingIntervalMs = 10000; // 10 seconds
  private maxBlocksPerPoll = 5000;
  private backoffAttempts = 0;
  private maxBackoffAttempts = 5;
  private processedTxs: Map<string, number> = new Map();
  private PROCESSING_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

  constructor(options: MOOptions) {
    this.wallet = options.wallet;
    this.chain = options.chain;
    this.currency = options.currency;
    this.address = options.address;
    this.contractType = options.contractType;
  }

  public async watchDeposits(): Promise<void> {
    let provider = chainProviders.get(this.chain);
    if (!provider) {
      provider = await initializeHttpProvider(this.chain);
      if (!provider) {
        throw new Error(
          `Failed to initialize HTTP provider for chain ${this.chain}`
        );
      }
    }
    console.log(
      `Using polling for ${this.chain} ERC-20 deposits on address ${this.address}`
    );
    const token = await getEcosystemToken(this.chain, this.currency);
    if (!token)
      throw new Error(
        `Token ${this.currency} not found for chain ${this.chain}`
      );
    const decimals = token.decimals;
    const filter = {
      address: token.contract,
      topics: [
        ethers.id("Transfer(address,address,uint256)"),
        null,
        ethers.zeroPadValue(this.address, 32),
      ],
    };

    // Start polling for events
    await this.pollForEvents(provider as JsonRpcProvider, filter, decimals);
    // Schedule periodic cleanup of processed transactions and store the interval ID
    this.cleanupIntervalId = setInterval(
      () => this.cleanupProcessedTxs(),
      60 * 1000
    );
  }

  private cleanupProcessedTxs() {
    const now = Date.now();
    for (const [txHash, timestamp] of this.processedTxs.entries()) {
      if (now - timestamp > this.PROCESSING_EXPIRY_MS) {
        this.processedTxs.delete(txHash);
      }
    }
  }

  private async pollForEvents(
    provider: JsonRpcProvider,
    filter: any,
    decimals: number
  ) {
    const pollingKey = `${this.chain}:${this.address}`;
    let lastBlock: number;
    try {
      lastBlock = await provider.getBlockNumber();
    } catch (err) {
      console.error(
        `Failed to get initial block number for ${pollingKey}: ${(err as Error).message}`
      );
      throw err;
    }
    this.intervalId = setInterval(async () => {
      try {
        const currentBlock = await provider.getBlockNumber();
        if (currentBlock > lastBlock) {
          const fromBlock = lastBlock + 1;
          const toBlock = Math.min(
            currentBlock,
            fromBlock + this.maxBlocksPerPoll - 1
          );
          console.log(
            `Polling ${pollingKey} from block ${fromBlock} to ${toBlock}`
          );
          const logs = await provider.getLogs({
            ...filter,
            fromBlock,
            toBlock,
          });
          this.backoffAttempts = 0;
          for (const log of logs) {
            if (this.processedTxs.has(log.transactionHash)) continue;
            console.log(
              `New event detected on ${pollingKey}: TxHash=${log.transactionHash}`
            );
            const success = await processTransaction(
              this.contractType,
              log.transactionHash,
              provider,
              this.address,
              this.chain,
              decimals,
              chainConfigs[this.chain].decimals,
              this.wallet.id
            );
            if (success) {
              console.log(`Deposit recorded for ${pollingKey}.`);
              this.processedTxs.set(log.transactionHash, Date.now());
            }
          }
          lastBlock = toBlock;
        }
      } catch (error) {
        console.error(
          `Error during event polling for ${pollingKey}:`,
          (error as Error).message
        );
        this.backoffAttempts++;
        if (this.backoffAttempts > this.maxBackoffAttempts) {
          console.error(
            `Max backoff attempts reached for ${pollingKey}. Stopping polling.`
          );
          this.stopPolling();
          return;
        }
        const backoffTime =
          this.pollingIntervalMs * Math.pow(2, this.backoffAttempts);
        console.warn(
          `Backing off polling for ${pollingKey}. Next poll in ${backoffTime}ms`
        );
        if (this.intervalId) {
          clearInterval(this.intervalId);
          this.intervalId = null;
        }
        setTimeout(() => {
          this.pollForEvents(provider, filter, decimals);
        }, backoffTime);
      }
    }, this.pollingIntervalMs);
  }

  // New stopPolling method that clears both polling and cleanup intervals
  public stopPolling() {
    if (this.intervalId) {
      console.log(`Stopping polling for ${this.chain}:${this.address}`);
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.cleanupIntervalId) {
      clearInterval(this.cleanupIntervalId);
      this.cleanupIntervalId = null;
    }
  }
}
