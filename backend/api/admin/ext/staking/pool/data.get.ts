import { models } from "@b/db";
import { structureSchema } from "@b/utils/constants";
import { createError } from "@b/utils/error";
import { CacheManager } from "@b/utils/cache";

export const metadata = {
  summary: "Get available currencies and chains for Staking Pools",
  operationId: "getStakingPoolCurrenciesChains",
  tags: ["Staking Pools"],
  responses: {
    200: {
      description: "List of available currencies and chains",
      content: structureSchema,
    },
  },
  requiresAuth: true,
};

export const stakingPoolCurrenciesChains = async () => {
  // Fetch fiat currencies
  const fiatCurrencies = await models.currency.findAll({
    where: { status: true },
    attributes: ["id"],
  });

  const fiatCurrencyOptions = fiatCurrencies.map((currency) => ({
    value: currency.id,
    label: currency.id,
  }));

  // Fetch spot currencies
  const spotCurrencies = await models.exchangeCurrency.findAll({
    where: { status: true },
    attributes: ["currency"],
  });

  const spotCurrencyOptions = spotCurrencies.map((currency) => ({
    value: currency.currency,
    label: currency.currency,
  }));

  // Fetch funding currencies and their chains (if the ecosystem extension is enabled)
  let fundingCurrencyOptions: any = [];
  const currencyChains: { [key: string]: string[] } = {};
  const cacheManager = CacheManager.getInstance();
  const extensions = await cacheManager.getExtensions();
  if (extensions.has("ecosystem")) {
    const allFundingCurrencies = await models.ecosystemToken.findAll({
      where: { status: true },
      attributes: ["currency", "chain"],
    });

    allFundingCurrencies.forEach((currency) => {
      if (!currencyChains[currency.currency]) {
        currencyChains[currency.currency] = [];
      }
      currencyChains[currency.currency].push(currency.chain);
    });

    // Ensure unique currencies for selection options
    const uniqueCurrencies = new Set(
      allFundingCurrencies.map((c) => c.currency)
    );
    fundingCurrencyOptions = Array.from(uniqueCurrencies).map((currency) => ({
      value: currency,
      label: currency,
    }));
  }

  return {
    currencies: {
      FIAT: fiatCurrencyOptions,
      SPOT: spotCurrencyOptions,
      ECO: fundingCurrencyOptions,
    },
    chains: currencyChains,
  };
};

export default async (data: Handler) => {
  const { user } = data;
  if (!user?.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const responseData = await stakingPoolCurrenciesChains();

  return responseData;
};
