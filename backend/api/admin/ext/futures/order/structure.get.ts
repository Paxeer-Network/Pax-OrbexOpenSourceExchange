import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for futures orders",
  operationId: "getFuturesOrderStructure",
  tags: ["Admin", "Futures Order"],
  responses: {
    200: {
      description: "Form structure for futures orders",
      content: structureSchema,
    },
  },
  permission: "Access Futures Order Management",
};

export const orderStructure = () => {
  const referenceId = {
    type: "input",
    label: "Reference ID",
    name: "referenceId",
    placeholder: "Enter reference ID",
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    options: [
      { value: "OPEN", label: "Open" },
      { value: "CLOSED", label: "Closed" },
      { value: "CANCELLED", label: "Cancelled" },
    ],
    placeholder: "Select status",
    ts: "string",
  };

  const symbol = {
    type: "input",
    label: "Symbol",
    name: "symbol",
    placeholder: "BTC/USD",
  };

  const type = {
    type: "select",
    label: "Type",
    name: "type",
    options: [
      { value: "LIMIT", label: "Limit" },
      { value: "MARKET", label: "Market" },
    ],
    placeholder: "Select type",
    ts: "string",
  };

  const timeInForce = {
    type: "select",
    label: "Time in Force",
    name: "timeInForce",
    options: [
      { value: "GTC", label: "Good Till Cancel" },
      { value: "IOC", label: "Immediate or Cancel" },
    ],
    placeholder: "Select Time in Force",
    ts: "string",
  };

  const side = {
    type: "select",
    label: "Side",
    name: "side",
    options: [
      { value: "BUY", label: "Buy" },
      { value: "SELL", label: "Sell" },
    ],
    placeholder: "Select Side",
    ts: "string",
  };

  const price = {
    type: "input",
    label: "Price",
    name: "price",
    placeholder: "Enter price",
    ts: "number",
  };

  const amount = {
    type: "input",
    label: "Amount",
    name: "amount",
    placeholder: "Enter amount",
    ts: "number",
  };

  const fee = {
    type: "input",
    label: "Fee",
    name: "fee",
    placeholder: "Enter fee",
    ts: "number",
  };

  const feeCurrency = {
    type: "input",
    label: "Fee Currency",
    name: "feeCurrency",
    placeholder: "USD",
  };

  return {
    referenceId,
    status,
    symbol,
    type,
    timeInForce,
    side,
    price,
    amount,
    fee,
    feeCurrency,
  };
};

export default async (): Promise<object> => {
  const {
    referenceId,
    status,
    symbol,
    type,
    timeInForce,
    side,
    price,
    amount,
    fee,
    feeCurrency,
  } = orderStructure();

  return {
    get: {
      orderDetails: [
        referenceId,
        status,
        symbol,
        type,
        timeInForce,
        side,
        price,
        amount,
        fee,
        feeCurrency,
      ],
    },
    set: [
      referenceId,
      symbol,
      [type, timeInForce],
      [status, side],
      [price, amount],
      [feeCurrency, fee],
    ],
  };
};
