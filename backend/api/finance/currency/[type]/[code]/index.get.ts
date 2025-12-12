import ExchangeManager from "@b/utils/exchange";
// /server/api/currencies/show.get.ts

import { baseCurrencySchema, baseResponseSchema } from "../../utils";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { createError } from "@b/utils/error";
import { models } from "@b/db";
import { Op, Sequelize } from "sequelize";

export const metadata: OperationObject = {
  summary: "Retrieves a single currency by its ID",
  description: "This endpoint retrieves a single currency by its ID.",
  operationId: "getCurrencyById",
  tags: ["Finance", "Currency"],
  requiresAuth: true,
  parameters: [
    {
      name: "action",
      in: "query",
      description: "The action to perform",
      required: false,
      schema: {
        type: "string",
      },
    },
    {
      index: 0,
      name: "type",
      in: "path",
      required: true,
      schema: {
        type: "string",
        enum: ["FIAT", "SPOT", "ECO"],
      },
    },
    {
      index: 1,
      name: "code",
      in: "path",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  responses: {
    200: {
      description: "Currency retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              ...baseResponseSchema,
              data: {
                type: "object",
                properties: baseCurrencySchema,
              },
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Currency"),
    500: serverErrorResponse,
  },
};

export default async (data: Handler) => {
  const { user, params, query } = data;
  if (!user?.id) throw createError(401, "Unauthorized");
  const { action } = query;

  const { type, code } = params;
  if (!type || !code) throw createError(400, "Invalid type or code");

  switch (action) {
    case "deposit":
      return handleDeposit(type, code);
    case "withdraw":
      return handleWithdraw(type, code);
    default:
      throw createError(400, "Invalid action");
  }
};

async function handleDeposit(type: string, code: string) {
  switch (type) {
    case "FIAT":
      const gateways = await models.depositGateway.findAll({
        where: {
          status: true,
          [Op.and]: Sequelize.literal(`JSON_CONTAINS(currencies, '"${code}"')`),
        },
      });

      const methods = await models.depositMethod.findAll({
        where: { status: true },
      });
      return { gateways, methods };
    case "SPOT":
      // Use ECO-style approach: return ecosystem tokens that can be deposited directly to user wallets
      const spotTokens = await models.ecosystemToken.findAll({
        where: { status: true, currency: code },
        attributes: [
          "name",
          "chain",
          "icon",
          "limits",
          "fee",
          "type",
          "contractType",
        ],
        order: [["chain", "ASC"]],
      });
      return spotTokens;
    case "ECO":
      const tokens = await models.ecosystemToken.findAll({
        where: { status: true, currency: code },
        attributes: [
          "name",
          "chain",
          "icon",
          "limits",
          "fee",
          "type",
          "contractType",
        ],
        order: [["chain", "ASC"]],
      });
      return tokens;
    default:
      throw createError(400, "Invalid wallet type");
  }
}

async function handleWithdraw(type: string, code: string) {
  switch (type) {
    case "FIAT":
      const methods = await models.withdrawMethod.findAll({
        where: { status: true },
      });

      return { methods };
    case "SPOT":
      const exchange = await ExchangeManager.startExchange();
      const provider = await ExchangeManager.getProvider();
      if (!exchange) throw createError(500, "Exchange not found");

      const currencyData = await models.exchangeCurrency.findOne({
        where: { currency: code, status: true },
      });
      if (!currencyData) {
        throw new Error("Currency not found");
      }
      const percentageFee = currencyData.fee || 0;

      const currencies: Record<string, ExchangeCurrency> =
        await exchange.fetchCurrencies();

      let currency: ExchangeCurrency | undefined = undefined;
      switch (provider) {
        case "xt":
          currency = Object.values(currencies).find((c) => c.code === code);
          break;
        default:
          currency = Object.values(currencies).find((c) => c.id === code);
          break;
      }

      if (!currency) throw createError(404, "Currency not found");
      if (!currency.active)
        throw createError(400, "Withdrawal not enabled for this currency");

      if (
        !currency.networks ||
        typeof currency.networks !== "object" ||
        !Object.keys(currency.networks).length
      ) {
        throw createError(400, "Networks data is missing or invalid");
      }

      return Object.values(currency.networks)
        .filter((network) => network.active && network.withdraw)
        .map((network) => ({
          id: network.id,
          chain: network.network || network.name,
          fixedFee: network.fee || network.fees?.withdraw || 0,
          percentageFee: percentageFee,
          precision: network.precision,
          limits: network.limits,
        }))
        .sort((a, b) => a.chain.localeCompare(b.chain));

    case "ECO":
      const tokens = await models.ecosystemToken.findAll({
        where: { status: true, currency: code },
        attributes: ["name", "chain", "icon", "limits", "fee", "type"],
        order: [["chain", "ASC"]],
      });
      return tokens.map((token) => ({
        ...(token.get({ plain: true }) as any),
        fee: typeof token.fee === "string" ? JSON.parse(token.fee) : token.fee,
        limits:
          typeof token.limits === "string"
            ? JSON.parse(token.limits)
            : token.limits,
      }));
    default:
      throw createError(400, "Invalid wallet type");
  }
}
