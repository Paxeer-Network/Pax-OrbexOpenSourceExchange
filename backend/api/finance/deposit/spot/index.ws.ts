// SPOT deposit websocket using ECO-style approach
import { createError } from "@b/utils/error";
import { models } from "@b/db";
import { getEcosystemToken } from "@b/utils/eco/tokens";
import { EVMDeposits } from "../../../ext/ecosystem/deposit/util/monitor/EVMDeposits";
import { UTXODeposits } from "../../../ext/ecosystem/deposit/util/monitor/UTXODeposits";
import { SolanaDeposits } from "../../../ext/ecosystem/deposit/util/monitor/SolanaDeposits";
import { TronDeposits } from "../../../ext/ecosystem/deposit/util/monitor/TronDeposits";
import { MoneroDeposits } from "../../../ext/ecosystem/deposit/util/monitor/MoneroDeposits";
import { TonDeposits } from "../../../ext/ecosystem/deposit/util/monitor/TonDeposits";
import { MODeposits } from "../../../ext/ecosystem/deposit/util/monitor/MODeposits";
import { createWorker } from "@b/utils/cron";
import { verifyPendingTransactions } from "../../../ext/ecosystem/deposit/util/PendingVerification";
import { isMainThread } from "worker_threads";

const monitorInstances = new Map(); // Maps userId -> monitor instance
const monitorStopTimeouts = new Map(); // Maps userId -> stopPolling timeout ID
let workerInitialized = false;
export const metadata = {};

export default async (data: Handler, message) => {
  const { user } = data;

  if (!user?.id) throw createError(401, "Unauthorized");
  if (typeof message === "string") {
    try {
      message = JSON.parse(message);
    } catch (err) {
      console.error(`Failed to parse incoming message: ${err.message}`);
      throw createError(400, "Invalid JSON payload");
    }
  }

  const { currency, chain, address } = message.payload;

  const wallet = await models.wallet.findOne({
    where: {
      userId: user.id,
      currency,
      type: "SPOT", // Use SPOT type instead of ECO
    },
  });

  if (!wallet) throw createError(400, "Wallet not found");
  if (!wallet.address) throw createError(400, "Wallet address not found");

  const addresses = await JSON.parse(wallet.address as any);
  const walletChain = addresses[chain];

  if (!walletChain) throw createError(400, "Address not found");

  const token = await getEcosystemToken(chain, currency);
  if (!token) throw createError(400, "Token not found");

  const contractType = token.contractType;
  const finalAddress =
    contractType === "NO_PERMIT" ? address : walletChain.address;

  const monitorKey = user.id;

  // Clear any pending stop timeouts since the user reconnected
  if (monitorStopTimeouts.has(monitorKey)) {
    clearTimeout(monitorStopTimeouts.get(monitorKey));
    monitorStopTimeouts.delete(monitorKey);
  }

  let monitor = monitorInstances.get(monitorKey);
  // If a monitor exists but is inactive (stopped), remove it and recreate
  if (monitor && monitor.active === false) {
    console.log(
      `Monitor for user ${monitorKey} is inactive. Creating a new monitor.`
    );
    monitorInstances.delete(monitorKey);
    monitor = null;
  }

  if (!monitor) {
    // No existing monitor for this user, create a new one
    monitor = createMonitor(chain, {
      wallet,
      currency,
      address: finalAddress,
      contractType,
    });
    monitorInstances.set(monitorKey, monitor);
  }

  monitor.startPolling();

  if (!workerInitialized && isMainThread) {
    const worker = await createWorker('pendingTransactionWorker', async () => {
      console.log('Spot pending transaction verification started');
      await verifyPendingTransactions();
    }, 5000);

    if (worker !== null) {
      workerInitialized = true;
    }
  }
};

function createMonitor(chain: string, options: any) {
  const { wallet, currency, address, contractType } = options;
  
  switch (chain) {
  case "BSC":
  case "ETH":
  case "POLYGON":
  case "FTM":
  case "ARBITRUM":
  case "OPTIMISM":
  case "BASE":
  case "CELO":
    return new EVMDeposits({ wallet, chain, currency, address, contractType });
  case "SOL":
    return new SolanaDeposits({ wallet, chain, currency, address });
  case "TRON":
    return new TronDeposits({ wallet, chain, address });
  case "XMR":
    return new MoneroDeposits({ wallet });
  case "TON":
    return new TonDeposits({ wallet, chain, address });
  case "MO":
    return new MODeposits({ wallet, chain, currency, address, contractType });
  default:
    return new EVMDeposits({ wallet, chain, currency, address, contractType });
  }
}

export const onClose = (ws, route, clientId) => {
  const monitorKey = clientId;

  if (monitorInstances.has(monitorKey)) {
    const monitor = monitorInstances.get(monitorKey);

    // Set a timeout to stop polling after 30 seconds if the user doesn't reconnect
    const timeoutId = setTimeout(() => {
      if (monitor) {
        monitor.stopPolling();
        console.log(
          `Monitor for user ${monitorKey} stopped due to disconnection.`
        );
      }
      monitorInstances.delete(monitorKey);
      monitorStopTimeouts.delete(monitorKey);
    }, 30000); // 30 seconds delay

    monitorStopTimeouts.set(monitorKey, timeoutId);
  }
};
