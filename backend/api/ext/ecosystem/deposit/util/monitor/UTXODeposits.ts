// UTXODeposits.ts
import { IDepositMonitor } from "./IDepositMonitor";
import {
  createTransactionDetailsForUTXO,
  recordUTXO,
  watchAddressBlockCypher,
} from "@b/utils/eco/utxo";
import { storeAndBroadcastTransaction } from "@b/utils/eco/redis/deposit";

interface UTXOOptions {
  wallet: walletAttributes;
  chain: string;
  address: string;
}

export class UTXODeposits implements IDepositMonitor {
  private wallet: walletAttributes;
  private chain: string;
  private address: string;

  constructor(options: UTXOOptions) {
    this.wallet = options.wallet;
    this.chain = options.chain;
    this.address = options.address;
  }

  public async watchDeposits(): Promise<void> {
    watchAddressBlockCypher(this.chain, this.address, async (transaction) => {
      try {
        const txDetails = await createTransactionDetailsForUTXO(
          this.wallet.id,
          transaction,
          this.address,
          this.chain
        );
        await storeAndBroadcastTransaction(txDetails, transaction.hash);

        transaction.outputs.forEach((output, index) => {
          if (output.addresses?.includes(this.address)) {
            recordUTXO(
              this.wallet.id,
              transaction.hash,
              index,
              output.value,
              output.script,
              false
            );
          }
        });
      } catch (error) {
        console.error(`Error in UTXO deposit handler: ${error.message}`);
      }
    });
  }
}
