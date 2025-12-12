/**
 * Safely parse transaction metadata from a string that may be escaped or nested.
 * @param metadataString Raw metadata as stored in the transaction (possibly escaped).
 * @returns Parsed metadata object (or empty object if nothing valid was found).
 */
export function parseTransactionMetadata(
  metadataString: string | null
): Record<string, any> {
  // Helper to check if a string is valid JSON
  function isValidJSON(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  }

  // Helper to unescape special characters
  function unescapeString(str: string): string {
    // Adjust as needed if you have more complex escaping
    return str.replace(/\\\"/g, '"').replace(/\\\\/g, "\\");
  }

  // If there's no metadata string at all, return an empty object
  if (!metadataString) {
    return {};
  }

  let metadataStr = metadataString;
  // If it's not valid JSON, unescape it first
  if (!isValidJSON(metadataStr)) {
    metadataStr = unescapeString(metadataStr);
  }

  let parsed: any;
  try {
    // First parse attempt
    parsed = JSON.parse(metadataStr);
  } catch (error: any) {
    console.error(
      "Error parsing transaction metadata on first attempt:",
      metadataStr,
      error?.message
    );
    throw new Error("Invalid transaction metadata on first attempt");
  }

  // If the parsed result is itself a string, try parsing again
  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed.trim());
    } catch (error: any) {
      console.error(
        "Error parsing transaction metadata on second attempt:",
        parsed,
        error?.message
      );
      throw new Error("Invalid transaction metadata on second attempt");
    }
  }

  // If everything worked, return the final parsed object
  // (You could do more checks here, e.g. ensure it's an object, etc.)
  return parsed && typeof parsed === "object" ? parsed : {};
}

// If you still want to map "BSC" => "BEP20" for xt, unify that logic here:
export function normalizeUserChain(chain: string): string {
  // If your front-end or DB calls it "BSC", we turn it into "BEP20"
  // If your front-end calls it "ETH", we turn it into "ERC20", etc.
  switch (chain?.toUpperCase()) {
    case "BSC":
      return "BEP20"; // for BSC
    case "ETH":
      return "ERC20"; // for Ethereum
    case "TRON":
      return "TRX"; // if user typed "TRON", you store "TRON"
    default:
      return chain; // no change for anything else
  }
}

// Map to EXACT strings xt wants (some might be identical to above):
/**
 * Converts a user/DB chain name into the EXACT string XT expects
 * based on your posted logs of fetchCurrencies().
 *
 * Example usage:
 *    const xtChain = mapToXtNetwork("BEP20");  // => "BNB Smart Chain"
 *    params.chain = xtChain;
 *    deposits = await exchange.fetchDeposits(code, undefined, undefined, params);
 */
export function mapToXtNetwork(chain: string): string {
  if (!chain) return chain;
  const c = chain.toUpperCase();

  switch (c) {
    // BNB Smart Chain
    case "BEP20":
    case "BSC":
    case "BINANCE SMART CHAIN":
    case "BSC SMART CHAIN":
      return "BNB Smart Chain";

    // Ethereum
    case "ERC20":
    case "ETH":
    case "ETHEREUM":
      return "Ethereum";

    // Tron
    case "TRC20":
    case "TRX":
    case "TRON":
      return "Tron";

    // Polygon
    case "MATIC":
    case "POLYGON":
      return "Polygon";

    // XT Smart Chain
    case "XT":
    case "XT SMART CHAIN":
      return "XT Smart Chain";

    // AVAX C-Chain
    case "AVAX":
    case "AVAX C-CHAIN":
      return "AVAX C-Chain";

    // Arbitrum
    // The logs show chain => 'ARB'
    case "ARB":
    case "ARBITRUM":
      return "ARB";

    // Optimism
    // The logs show chain => 'OPT'
    case "OP":
    case "OPT":
    case "OPTIMISM":
      return "OPT";

    // Solana USDT
    // The logs show chain => 'SOL-SOL'
    case "SOL":
    case "SOL-SOL":
      return "SOL-SOL";

    // GateChain
    case "GATECHAIN":
      return "GateChain";

    // TON
    case "TON":
      return "TON";

    // opBNB
    case "OPBNB":
      return "OPBNB";

    default:
      // Fallback: return as-is if it's not in our map
      return chain;
  }
}

/**
 * Parses `transaction.metadata`, normalizes the chain from user’s naming
 * into something we can pass to xt (e.g., 'BSC' => 'BEP20'),
 * and then returns that final chain.
 *
 * @param {string | null} metadataString - raw transaction.metadata
 * @returns {{ metadata: Record<string, any>, xtChain?: string }}
 *          metadata: the final parsed object
 *          xtChain:  the chain name to pass in { network: xtChain }
 */
export function parseMetadataAndMapChainToXt(metadataString: string | null) {
  // 1) Parse the JSON (handling escaped strings, nested JSON, etc.)
  const metadata = parseTransactionMetadata(metadataString);

  // 2) If the metadata has a 'chain', normalize it from user naming
  let userChain = metadata.chain;
  if (!userChain) {
    return { metadata, xtChain: undefined };
  }

  //   - convert (BSC => BEP20, ETH => ERC20, TRON => TRX, etc.)
  const normalized = normalizeUserChain(userChain);

  // 3) Finally map that normalized chain to the EXACT string xt expects
  const xtChain = mapToXtNetwork(normalized);

  return { metadata, xtChain };
}
