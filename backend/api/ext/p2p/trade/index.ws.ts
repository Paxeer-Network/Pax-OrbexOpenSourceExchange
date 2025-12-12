import { models } from "@b/db";
import { sendMessageToRoute } from "@b/handler/Websocket";
import { createError } from "@b/utils/error";
import { sendP2PTradeReplyEmail } from "./utils";

export const metadata: any = {};

export default async (data: Handler, parsedMessage) => {
  const { user } = data;

  if (!user?.id) throw createError(401, "Unauthorized");

  const { payload } = parsedMessage;
  if (!payload.id) return;

  const trade = await models.p2pTrade.findByPk(payload.id, {
    include: [
      {
        model: models.user,
        as: "seller",
        attributes: ["email", "avatar", "firstName", "lastName", "lastLogin"],
      },
      {
        model: models.user,
        as: "user",
        attributes: ["email", "avatar", "firstName", "lastName", "lastLogin"],
      },
    ],
  });
  if (!trade) return;

  if (trade.status === "CANCELLED") {
    sendMessageToRoute(
      `/api/ext/p2p/trade`,
      { id: payload.id },
      {
        method: "update",
        data: {
          status: trade.status,
          updatedAt: new Date(),
        },
      }
    );
    throw createError({ statusCode: 400, message: "Ticket is cancelled" });
  }

  if (!payload.message) return;
  const { type, time, userId } = payload.message;

  // Validate message structure
  if (!type || !time || !userId) return;

  // Filter out irrelevant messages
  if (type !== "buyer" && type !== "seller") return;
  if (userId !== user.id) return;

  if (!trade.sellerId && type === "seller") trade.sellerId = user.id;

  // Update trade messages
  const messages: ChatMessage[] = trade.messages || [];
  messages.push(payload.message);
  trade.messages = messages;

  await trade.save();

  try {
    const receiver = type === "seller" ? trade.user : trade.seller;
    const sender = type === "seller" ? trade.seller : trade.user;

    await sendP2PTradeReplyEmail(receiver, sender, trade, payload.message);
  } catch (error) {
    console.error("Error sending email", error);
  }

  sendMessageToRoute(
    `/api/ext/p2p/trade`,
    { id: payload.id },
    {
      method: "reply",
      data: {
        message: payload.message,
        updatedAt: new Date(),
      },
    }
  );
};
