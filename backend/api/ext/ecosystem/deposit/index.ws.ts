// index.ws.ts
import { createError } from "@b/utils/error";
import { models } from "@b/db";
import { getEcosystemToken } from "@b/utils/eco/tokens";
import { EVMDeposits } from "./util/monitor/EVMDeposits";
import { UTXODeposits } from "./util/monitor/UTXODeposits";
import { SolanaDeposits } from "./util/monitor/SolanaDeposits";
import { TronDeposits } from "./util/monitor/TronDeposits";
import { MoneroDeposits } from "./util/monitor/MoneroDeposits";
import { TonDeposits } from "./util/monitor/TonDeposits";
import { MODeposits } from "./util/monitor/MODeposits";
import { createWorker } from "@b/utils/cron";
import { verifyPendingTransactions } from "./util/PendingVerification";
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
      type: "ECO",
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
      chain,
      currency,
      address: finalAddress,
      contractType,
    });
    await monitor.watchDeposits();
    monitorInstances.set(monitorKey, monitor);
  } else {
    // Monitor already exists, just reuse it
    console.log(`Reusing existing monitor for user ${monitorKey}`);
  }

  if (isMainThread && !workerInitialized) {
    await createWorker(
      "verifyPendingTransactions",
      verifyPendingTransactions,
      10000
    );
    console.log("Verification worker started");
    workerInitialized = true;
  }
};

function createMonitor(chain: string, options: any) {
  const { wallet, currency, address, contractType } = options;

  if (["BTC", "LTC", "DOGE", "DASH"].includes(chain)) {
    return new UTXODeposits({ wallet, chain, address });
  } else if (chain === "SOL") {
    return new SolanaDeposits({ wallet, chain, currency, address });
  } else if (chain === "TRON") {
    return new TronDeposits({ wallet, chain, address });
  } else if (chain === "XMR") {
    return new MoneroDeposits({ wallet });
  } else if (chain === "TON") {
    return new TonDeposits({ wallet, chain, address });
  } else if (chain === "MO" && contractType !== "NATIVE") {
    return new MODeposits({ wallet, chain, currency, address, contractType });
  } else {
    return new EVMDeposits({ wallet, chain, currency, address, contractType });
  }
}

export const onClose = async (ws, route, clientId) => {
  // Clear any previous pending stop timeouts for this client
  if (monitorStopTimeouts.has(clientId)) {
    clearTimeout(monitorStopTimeouts.get(clientId));
    monitorStopTimeouts.delete(clientId);
  }

  const monitor = monitorInstances.get(clientId);

  if (monitor && typeof monitor.stopPolling === "function") {
    // Schedule stopPolling after 10 minutes if the user doesn't reconnect
    const timeoutId = setTimeout(
      () => {
        monitor.stopPolling();
        monitorStopTimeouts.delete(clientId);
        monitorInstances.delete(clientId);
      },
      10 * 60 * 1000
    ); // 10 minutes

    monitorStopTimeouts.set(clientId, timeoutId);
  }
};
