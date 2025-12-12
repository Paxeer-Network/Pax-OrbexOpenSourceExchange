import { models } from "@b/db";
import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for Futures Markets",
  operationId: "getFuturesMarketStructure",
  tags: ["Admin", "Futures Markets"],
  responses: {
    200: {
      description: "Form structure for managing Futures Markets",
      content: structureSchema,
    },
  },
  permission: "Access Futures Market Management",
};

export const futuresMarketStructure = async () => {
  const tokens = (await models.ecosystemToken.findAll({
    where: { status: true },
    order: [["currency", "ASC"]],
  })) as any[];

  const uniqueCurrencies = tokens.reduce((acc, token) => {
    if (token.currency && !acc.includes(token.currency)) {
      acc.push(token.currency);
    }
    return acc;
  }, []);

  const tokenOptions = uniqueCurrencies.map((currency) => ({
    label: currency,
    value: currency,
  }));

  const currency = {
    type: "select",
    label: "Currency",
    name: "currency",
    options: tokenOptions,
  };

  const pair = {
    type: "select",
    label: "Pair",
    name: "pair",
    options: tokenOptions,
  };

  const isTrending = {
    type: "select",
    label: "Is Trending",
    name: "isTrending",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
    ts: "boolean",
  };

  const isHot = {
    type: "select",
    label: "Is Hot",
    name: "isHot",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
    ts: "boolean",
  };

  const metadata = {
    type: "object",
    name: "metadata",
    label: "Metadata",
    fields: [
      [
        {
          type: "input",
          label: "Taker Fee",
          name: "taker",
          placeholder: "Enter the taker fee percentage",
          ts: "number",
        },
        {
          type: "input",
          label: "Maker Fee",
          name: "maker",
          placeholder: "Enter the maker fee percentage",
          ts: "number",
        },
      ],
      {
        type: "object",
        label: "Precision",
        name: "precision",
        fields: [
          [
            {
              type: "input",
              label: "Amount",
              name: "amount",
              placeholder: "Enter the amount precision (decimals)",
              ts: "number",
            },
            {
              type: "input",
              label: "Price",
              name: "price",
              placeholder: "Enter the price precision (decimals)",
              ts: "number",
            },
          ],
        ],
      },
      {
        type: "object",
        label: "Limits",
        name: "limits",
        fields: [
          [
            {
              type: "object",
              label: "Amount",
              name: "amount",
              fields: [
                {
                  type: "input",
                  label: "Min",
                  name: "min",
                  placeholder: "Enter the minimum amount",
                  ts: "number",
                },
                {
                  type: "input",
                  label: "Max",
                  name: "max",
                  placeholder: "Enter the maximum amount",
                  ts: "number",
                },
              ],
            },
            {
              type: "object",
              label: "Price",
              name: "price",
              fields: [
                {
                  type: "input",
                  label: "Min",
                  name: "min",
                  placeholder: "Enter the minimum price",
                  ts: "number",
                },
                {
                  type: "input",
                  label: "Max",
                  name: "max",
                  placeholder: "Enter the maximum price",
                  ts: "number",
                },
              ],
            },
          ],
          [
            {
              type: "object",
              label: "Cost",
              name: "cost",
              fields: [
                {
                  type: "input",
                  label: "Min",
                  name: "min",
                  placeholder: "Enter the minimum cost",
                  ts: "number",
                },
                {
                  type: "input",
                  label: "Max",
                  name: "max",
                  placeholder: "Enter the maximum cost",
                  ts: "number",
                },
              ],
            },
            {
              type: "input",
              label: "Leverage",
              name: "leverage",
              placeholder:
                "Enter the leverage, multiple values separated by comma",
            },
          ],
        ],
      },
    ],
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    placeholder: "Check if the market is active",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
    ts: "boolean",
  };

  return {
    currency,
    pair,
    isTrending,
    isHot,
    metadata,
    status,
  };
};

export default async () => {
  const { currency, pair, isTrending, isHot, metadata, status } =
    await futuresMarketStructure();

  return {
    get: [currency, pair, [isTrending, isHot], metadata, status],
    set: [[currency, pair], [isTrending, isHot], metadata],
    edit: [[isTrending, isHot], metadata],
  };
};
