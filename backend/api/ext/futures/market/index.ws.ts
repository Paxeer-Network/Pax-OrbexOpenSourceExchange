import { sendMessageToRoute } from "@b/handler/Websocket";
import { FuturesMatchingEngine } from "@b/utils/futures/matchingEngine";
import { getOrderBook } from "@b/utils/futures/queries/orderbook";

export const metadata = {};

export default async (data: Handler, message) => {
  if (typeof message === "string") {
    message = JSON.parse(message);
  }

  const { type, symbol } = message.payload;

  switch (type) {
    case "orderbook":
      const orderbook = await getOrderBook(symbol);

      sendMessageToRoute(
        `/api/ext/futures/market`,
        { type: "orderbook", symbol },
        {
          stream: "orderbook",
          data: orderbook,
        }
      );
      break;
    case "trades":
      sendMessageToRoute(
        `/api/ext/futures/market`,
        { type: "trades", symbol },
        {
          stream: "trades",
          data: [],
        }
      );
      break;
    case "ticker":
      const engine = await FuturesMatchingEngine.getInstance();
      const ticker = await engine.getTicker(symbol);
      sendMessageToRoute(
        `/api/ext/futures/market`,
        { type: "ticker", symbol },
        {
          stream: "ticker",
          data: ticker,
        }
      );
      break;
    default:
      break;
  }
};
