import { sendMessageToRoute } from "@b/handler/Websocket";
import { FuturesMatchingEngine } from "@b/utils/futures/matchingEngine";

export const metadata = {};

export default async (data: Handler, message) => {
  if (typeof message === "string") {
    message = JSON.parse(message);
  }

  const engine = await FuturesMatchingEngine.getInstance();
  const tickers = await engine.getTickers();

  sendMessageToRoute(
    `/api/ext/futures/ticker`,
    { type: "tickers" },
    {
      stream: "tickers",
      data: tickers,
    }
  );
};
