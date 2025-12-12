import { sendMessageToRoute } from "@b/handler/Websocket";
import { MatchingEngine } from "@b/utils/eco/matchingEngine";

export const metadata = {};

export default async (data: Handler, message) => {
  if (typeof message === "string") {
    message = JSON.parse(message);
  }

  const engine = await MatchingEngine.getInstance();
  const tickers = await engine.getTickers();

  sendMessageToRoute(
    `/api/ext/ecosystem/ticker`,
    { type: "tickers" },
    {
      stream: "tickers",
      data: tickers,
    }
  );
};
