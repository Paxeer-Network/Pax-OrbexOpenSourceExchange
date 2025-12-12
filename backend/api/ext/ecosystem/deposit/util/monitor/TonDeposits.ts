// TonDeposits.ts
import { IDepositMonitor } from "./IDepositMonitor";
import TonService from "@b/blockchains/ton";

interface TonOptions {
  wallet: walletAttributes;
  chain: string;
  address: string;
}

export class TonDeposits implements IDepositMonitor {
  private wallet: walletAttributes;
  private chain: string;
  private address: string;

  constructor(options: TonOptions) {
    this.wallet = options.wallet;
    this.chain = options.chain;
    this.address = options.address;
  }

  public async watchDeposits(): Promise<void> {
    const tonService = await TonService.getInstance();
    await tonService.monitorTonDeposits(this.wallet, this.address);
  }
}
