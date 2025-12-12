// scripts/processEndedAuctions.ts

import { models, sequelize } from "@b/db";
import { Op } from "sequelize";
import { handleNotification } from "../notifications";

async function processEndedAuctions() {
  const transaction = await sequelize.transaction();

  try {
    const endedAuctions = (await models.nftAuction.findAll({
      where: {
        status: "ACTIVE",
        endTime: { [Op.lte]: new Date() },
      },
      include: [
        {
          model: models.nftBid,
          as: "nftBids",
          where: { status: "PENDING" },
          required: false,
          separate: true,
          order: [["amount", "DESC"]],
          limit: 1,
        },
        {
          model: models.nftAsset,
          as: "nftAsset",
        },
      ],
    })) as any[];

    for (const auction of endedAuctions) {
      if (auction.nftBids.length > 0) {
        const highestBid = auction.nftBids[0];

        // Check if reserve price is met
        if (auction.reservePrice && highestBid.amount < auction.reservePrice) {
          // Reserve price not met, cancel auction
          await auction.update({ status: "CANCELLED" }, { transaction });
          await highestBid.update({ status: "DECLINED" }, { transaction });
        } else {
          // Complete the transaction
          const nftAsset = auction.nftAsset;
          const sellerId = nftAsset.ownerId;
          const buyerId = highestBid.bidderId;
          const price = highestBid.amount;

          // Transfer ownership
          await nftAsset.update({ ownerId: buyerId }, { transaction });

          // Record the transaction
          // await models.nftTransaction.create(
          //   {
          //     nftAssetId: nftAsset.id,
          //     sellerId,
          //     buyerId,
          //     price,
          //     transactionHash: generateTransactionHash(),
          //     status: "COMPLETED",
          //   },
          //   { transaction }
          // );

          // Update auction and bid status
          await auction.update({ status: "COMPLETED" }, { transaction });
          await highestBid.update({ status: "ACCEPTED" }, { transaction });

          // Send notifications
          await handleNotification({
            userId: sellerId,
            title: "Auction Sold",
            message: `Your NFT "${nftAsset.name}" has been sold via auction.`,
            type: "ACTIVITY",
          });

          await handleNotification({
            userId: buyerId,
            title: "Auction Won",
            message: `You have won the auction for "${nftAsset.name}".`,
            type: "ACTIVITY",
          });
        }
      } else {
        // No bids, cancel auction
        await auction.update({ status: "CANCELLED" }, { transaction });
      }
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.error("Error processing ended auctions:", error);
  }
}

function generateTransactionHash(): string {
  return "0x" + Math.random().toString(16).substr(2, 64);
}

// Schedule this function to run periodically
processEndedAuctions();
