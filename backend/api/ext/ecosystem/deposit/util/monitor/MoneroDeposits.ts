// MoneroDeposits.ts
import { IDepositMonitor } from "./IDepositMonitor";
import MoneroService from "@b/blockchains/xmr";

interface MoneroOptions {
  wallet: walletAttributes;
}

export class MoneroDeposits implements IDepositMonitor {
  private wallet: walletAttributes;

  constructor(options: MoneroOptions) {
    this.wallet = options.wallet;
  }

  public async watchDeposits(): Promise<void> {
    const moneroService = await MoneroService.getInstance();
    await moneroService.monitorMoneroDeposits(this.wallet);
  }
}
