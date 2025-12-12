import { models, sequelize } from "@b/db";
import ExchangeManager from "@b/utils/exchange";
import { handleBanStatus, loadBanStatus } from "@b/api/exchange/utils";
import { MatchingEngine } from "@b/utils/eco/matchingEngine";
import { RedisSingleton } from "@b/utils/redis";
import {
  baseBooleanSchema,
  baseNumberSchema,
  baseObjectSchema,
  baseStringSchema,
} from "@b/utils/schema";
import { isNumber } from "lodash";
import { createError } from "@b/utils/error";
const redis = RedisSingleton.getInstance();

export const baseCurrencySchema = {
  id: baseNumberSchema("ID of the currency"),
  name: baseStringSchema("Currency name"),
  symbol: baseStringSchema("Currency symbol"),
  precision: baseNumberSchema("Currency precision"),
  price: baseNumberSchema("Currency price"),
  status: baseBooleanSchema("Currency status"),
};

export const baseResponseSchema = {
  status: baseBooleanSchema("Indicates if the request was successful"),
  statusCode: baseNumberSchema("HTTP status code"),
  data: baseObjectSchema("Detailed data response"),
};

export async function cacheCurrencies() {
  try {
    const currencies = await getCurrencies();
    await redis.set("currencies", JSON.stringify(currencies), "EX", 300); // Cache for 5 minutes
  } catch (error) {}
}

cacheCurrencies();

export async function updateCurrencyRates(
  rates: Record<string, number>
): Promise<Currency[]> {
  await sequelize.transaction(async (transaction) => {
    const codes = Object.keys(rates);

    // Validate each rate before processing
    codes.forEach((code) => {
      const price = rates[code];
      if (!isNumber(price) || isNaN(price)) {
        throw new Error(`Invalid price for currency ${code}: ${price}`);
      }
    });

    // Create a batch of update operations
    const updatePromises = codes.map((code) => {
      return models.currency.update(
        { price: rates[code] },
        { where: { id: code }, transaction }
      );
    });

    // Execute all updates within a transaction
    await Promise.all(updatePromises);
  });

  const updatedCurrencies = await models.currency.findAll({
    where: { id: Object.keys(rates) },
  });

  // Map Sequelize instances to plain objects.
  return updatedCurrencies.map((currency) =>
    currency.get({ plain: true })
  ) as unknown as Currency[];
}

// Helper Functions
export async function findCurrencyById(id: string) {
  const currency = await models.currency.findOne({
    where: { id },
  });
  if (!currency) throw new Error("Currency not found");
  return currency;
}

export async function getCurrencies(): Promise<Currency[]> {
  const currencies = await models.currency.findAll({
    where: { status: "true" }, // Assuming status is stored as string 'true'/'false'
    order: [["id", "ASC"]],
  });

  return currencies.map((currency) =>
    currency.get({ plain: true })
  ) as unknown as Currency[];
}

export const getFiatPriceInUSD = async (currency) => {
  const fiatCurrency = await models.currency.findOne({
    where: { id: currency, status: true },
  });
  if (!fiatCurrency) {
    throw createError(404, `Currency ${currency} not found`);
  }
  return parseFloat(fiatCurrency.price);
};

export const getSpotPriceInUSD = async (currency) => {
  if (currency === "USDT") {
    return 1;
  }

  const exchange = await ExchangeManager.startExchange();
  if (!exchange) {
    throw createError(
      503,
      "Service temporarily unavailable. Please try again later."
    );
  }

  try {
    const unblockTime = await loadBanStatus();
    if (await handleBanStatus(unblockTime)) {
      throw createError(
        503,
        "Service temporarily unavailable. Please try again later."
      );
    }
    const ticker = await exchange.fetchTicker(`${currency}/USDT`);
    const price = ticker.last;
    if (!price) {
      throw new Error("Error fetching ticker data");
    }
    return price;
  } catch (error) {
    if (error.statusCode === 503) {
      throw error;
    }
    throw new Error("Error fetching market data");
  }
};

export const getEcoPriceInUSD = async (currency) => {
  if (currency === "USDT") {
    return 1;
  }

  const engine = await MatchingEngine.getInstance();
  try {
    const ticker = await engine.getTicker(`${currency}/USDT`);
    const price = ticker.last;
    if (!price) {
      throw new Error("Error fetching ticker data");
    }
    return price;
  } catch (error) {
    throw new Error("Error fetching market data");
  }
};
