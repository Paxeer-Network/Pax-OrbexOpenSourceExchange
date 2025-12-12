import { models, sequelize } from "@b/db";
import { createError } from "@b/utils/error";
import { sendP2PTradeCompletionEmail } from "../utils";
import { processRewards } from "@b/utils/affiliate";
import { getTokenContractAddress } from "@b/utils/eco/tokens";
import {
  getWalletByUserIdAndCurrency,
  updatePrivateLedger,
} from "@b/utils/eco/wallet";
import {
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { sendMessageToRoute } from "@b/handler/Websocket";
import { handleNotification } from "@b/utils/notifications";
import { Op } from "sequelize";
import { CacheManager } from "@b/utils/cache";

export const metadata: OperationObject = {
  summary: "Releases funds for a completed P2P trade",
  description:
    "Finalizes a P2P trade by releasing funds to the buyer after confirmation of payment.",
  operationId: "releaseTrade",
  tags: ["P2P", "Trade"],
  requiresAuth: true,
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: { type: "string", description: "ID of the trade" },
    },
  ],
  responses: {
    200: {
      description: "Trade released successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "string", description: "ID of the trade" },
              status: { type: "string", description: "Status of the trade" },
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("P2P Trade"),
    500: serverErrorResponse,
  },
};

export default async (data: Handler) => {
  const { params, user } = data;
  if (!user?.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  const { id } = params;

  try {
    const result = await handleTradeRelease(id, user);
    return result;
  } catch (error) {
    if (error.statusCode) {
      return { error: error.message };
    }
    return { error: "Failed to release trade" };
  }
};

export async function handleTradeRelease(id: string, user: any = null) {
  return await sequelize.transaction(async (transaction) => {
    const trade = await models.p2pTrade.findOne({
      where: { id },
      include: [
        { model: models.p2pOffer, as: "offer" },
        {
          model: models.user,
          as: "user",
          attributes: ["id", "email", "firstName", "lastName"],
        },
        {
          model: models.user,
          as: "seller",
          attributes: ["id", "email", "firstName", "lastName"],
        },
      ],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!trade)
      throw createError({ statusCode: 404, message: "Trade not found" });

    if (!["PAID", "DISPUTE_OPEN"].includes(trade.status))
      throw createError({
        statusCode: 400,
        message: "Trade can only be released if it is paid or in dispute",
      });

    const userId = trade.sellerId;
    if (user && user.id !== userId) {
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }

    let wallet = await models.wallet.findOne({
      where: {
        userId: trade.userId, // Buyer's wallet
        type: trade.offer.walletType,
        currency: trade.offer.currency,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    const cacheManager = CacheManager.getInstance();
    const extensions = await cacheManager.getExtensions();
    if (!wallet) {
      if (trade.offer.walletType === "ECO") {
        if (!trade.offer.chain)
          throw createError({
            statusCode: 400,
            message: "Chain not found in trade offer",
          });

        const tokenData = await getTokenContractAddress(
          trade.offer.chain,
          trade.offer.currency
        );

        if (extensions.has("ecosystem")) {
          try {
            wallet = await getWalletByUserIdAndCurrency(
              trade.userId,
              trade.offer.currency
            );
          } catch (error) {
            console.error("Failed to create or retrieve wallet", error);
            throw createError({
              statusCode: 500,
              message:
                "Failed to create or retrieve wallet, please contact support",
            });
          }
        }
      } else {
        wallet = await models.wallet.create(
          {
            userId: trade.userId,
            type: trade.offer.walletType,
            currency: trade.offer.currency,
          },
          { transaction }
        );
      }
    }

    if (!wallet)
      throw createError({ statusCode: 404, message: "Buyer wallet not found" });

    let commission = 0;
    const settings = await cacheManager.getSettings();
    const commissionPercentage = settings.get("p2pCommission");
    if (
      commissionPercentage &&
      commissionPercentage.value &&
      Number(commissionPercentage.value) !== 0
    ) {
      commission = (trade.amount * Number(commissionPercentage.value)) / 100;
    }
    const balance = wallet.balance + trade.amount - commission;
    const commissionedAmount = trade.amount - commission;

    await wallet.update({ balance: balance }, { transaction });

    if (
      trade.offer.walletType === "ECO" &&
      trade.offer.chain &&
      trade.offer.currency
    ) {
      const walletData = await models.walletData.findOne({
        where: {
          walletId: wallet.id,
          chain: trade.offer.chain,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!walletData) {
        console.error(
          `Failed to find wallet data for wallet ${wallet.id} and chain ${trade.offer.chain}`
        );
        throw createError({
          statusCode: 500,
          message: "Failed to find wallet data, please contact support",
        });
      }

      await updatePrivateLedger(
        wallet.id,
        walletData.index,
        trade.offer.currency,
        trade.offer.chain,
        -trade.amount
      );
    }

    if (commission > 0) {
      await models.p2pCommission.create(
        {
          tradeId: trade.id,
          amount: commission,
        },
        { transaction }
      );
    }

    // Close all disputes associated with the trade
    await models.p2pDispute.update(
      { status: "RESOLVED" },
      {
        where: {
          tradeId: trade.id,
          status: {
            [Op.in]: ["PENDING", "OPEN"],
          },
        },
        transaction,
      }
    );

    const newAmount = trade.offer.amount - trade.amount;
    const newInOrder = trade.offer.inOrder - trade.amount;
    const newStatus = newAmount === 0 ? "COMPLETED" : "ACTIVE";
    await models.p2pOffer.update(
      {
        amount: newAmount,
        inOrder: newInOrder,
        status: newStatus,
      },
      {
        where: { id: trade.offerId },
        transaction,
      }
    );

    await models.transaction.create(
      {
        userId: trade.userId, // Buyer's transaction
        walletId: wallet.id,
        amount: commissionedAmount,
        description: `P2P trade ${trade.id} release`,
        status: "COMPLETED",
        fee: commission,
        type: "P2P_TRADE",
        referenceId: trade.id,
      },
      { transaction }
    );

    // **Admin Profit Recording:**
    if (commission > 0) {
      await models.adminProfit.create(
        {
          amount: commission,
          currency: wallet.currency,
          type: "P2P_TRADE",
          transactionId: trade.id,
          description: `Admin profit from P2P trade commission of ${commission} ${wallet.currency} for trade (${trade.id})`,
        },
        { transaction }
      );
    }

    await models.p2pTrade.update(
      { status: "COMPLETED" },
      {
        where: { id: trade.id },
        transaction,
      }
    );

    await processRewards(
      trade.userId, // Buyer's rewards
      commissionedAmount,
      "P2P_TRADE",
      wallet.currency
    );

    try {
      const buyer = trade.user;
      const seller = trade.seller;
      await sendP2PTradeCompletionEmail(buyer, seller, trade);
      await sendP2PTradeCompletionEmail(seller, buyer, trade);
      await handleNotification({
        userId: trade.userId,
        title: "Trade Completed",
        message: `Trade #${trade.id} has been completed`,
        type: "ACTIVITY",
      });
      await handleNotification({
        userId: trade.sellerId,
        title: "Trade Completed",
        message: `Trade #${trade.id} has been completed`,
        type: "ACTIVITY",
      });
    } catch (error) {
      console.error("Failed to send email", error);
    }

    const updatedTrade = await models.p2pTrade.findOne({
      where: { id: trade.id },
      transaction,
    });

    if (!updatedTrade)
      throw createError({ statusCode: 404, message: "Trade not found" });

    try {
      sendMessageToRoute(
        `/api/ext/p2p/trade`,
        { id },
        {
          method: "update",
          data: {
            ...updatedTrade.get({ plain: true }),
          },
        }
      );
    } catch (error) {
      console.error("Failed to send message to route", error);
    }

    return { id: trade.id, status: "COMPLETED" };
  });
}
