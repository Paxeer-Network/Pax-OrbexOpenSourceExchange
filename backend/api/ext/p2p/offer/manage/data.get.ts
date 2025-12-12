// /server/api/p2p/offers/structure.get.ts

import { models } from "@b/db";
import { structureSchema } from "@b/utils/constants";
import { createError } from "@b/utils/error";
import { CacheManager } from "@b/utils/cache";

export const metadata = {
  summary:
    "Get available payment methods, currencies, and chains for P2P Offers",
  operationId: "getP2pOfferPaymentMethodsCurrenciesChains",
  tags: ["P2P Offers"],
  responses: {
    200: {
      description: "List of available payment methods, currencies, and chains",
      content: structureSchema,
    },
  },
  requiresAuth: true,
};

export const p2pOfferPaymentMethodsCurrenciesChains = async (
  userId: string
) => {
  // Fetch payment methods
  const paymentMethods = await models.p2pPaymentMethod.findAll({
    where: { status: true, userId },
  });

  const paymentMethodOptions = paymentMethods.map((method) => ({
    value: method.id,
    label: method.name,
  }));

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
    paymentMethods: paymentMethodOptions,
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

  const responseData = await p2pOfferPaymentMethodsCurrenciesChains(user.id);

  return responseData;
};
