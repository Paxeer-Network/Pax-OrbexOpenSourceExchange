import { sendMessageToRoute } from "@b/handler/Websocket";
import { MatchingEngine } from "@b/utils/eco/matchingEngine";
import { getOrderBook } from "@b/utils/eco/scylla/queries";

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
        `/api/ext/ecosystem/market`,
        { type: "orderbook", symbol },
        {
          stream: "orderbook",
          data: orderbook,
        }
      );
      break;
    case "trades":
      sendMessageToRoute(
        `/api/ext/ecosystem/market`,
        { type: "trades", symbol },
        {
          stream: "trades",
          data: [],
        }
      );
      break;
    case "ticker":
      const engine = await MatchingEngine.getInstance();
      const ticker = await engine.getTicker(symbol);
      sendMessageToRoute(
        `/api/ext/ecosystem/market`,
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
