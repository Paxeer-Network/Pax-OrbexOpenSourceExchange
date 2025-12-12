import { emailQueue } from "@b/utils/emails";
import {
  baseStringSchema,
  baseNumberSchema,
  baseDateTimeSchema,
  baseEnumSchema,
} from "@b/utils/schema";

const id = baseStringSchema("ID of the P2P Trade");
const userId = baseStringSchema("ID of the Buyer User");
const sellerId = baseStringSchema("ID of the Seller User");
const offerId = baseStringSchema(
  "ID of the P2P Offer associated with the trade"
);
const amount = baseNumberSchema("Amount involved in the trade");
const status = baseEnumSchema("Current status of the trade", [
  "PENDING",
  "PAID",
  "DISPUTE_OPEN",
  "ESCROW_REVIEW",
  "CANCELLED",
  "COMPLETED",
  "REFUNDED",
]);
const messages = baseStringSchema(
  "Messages related to the trade",
  255,
  0,
  true
);
const txHash = baseStringSchema("Transaction hash if applicable", 255, 0, true);
const createdAt = baseDateTimeSchema("Creation date of the trade");
const updatedAt = baseDateTimeSchema("Last update date of the trade");

export const p2pTradeSchema = {
  id,
  userId,
  sellerId,
  offerId,
  amount,
  status,
  messages,
  txHash,
  createdAt,
  updatedAt,
};

export const baseP2pTradeSchema = {
  id,
  userId,
  sellerId,
  offerId,
  amount,
  status,
  messages,
  txHash,
  createdAt,
  updatedAt,
  deletedAt: baseDateTimeSchema("Deletion date of the trade, if any"),
};

export const p2pTradeUpdateSchema = {
  type: "object",
  properties: {
    status,
    messages,
    txHash,
  },
  required: ["status"], // Adjust according to business logic if necessary
};

export const p2pTradeStoreSchema = {
  description: `P2P Trade created or updated successfully`,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: baseP2pTradeSchema,
      },
    },
  },
};

export async function sendP2PTradeSaleConfirmationEmail(
  seller,
  buyer,
  trade,
  offer
) {
  const emailData = {
    TO: seller.email,
    SELLER_NAME: seller.firstName,
    BUYER_NAME: buyer.firstName,
    CURRENCY: offer.currency,
    AMOUNT: trade.amount.toString(),
    PRICE: offer.price.toString(),
    TRADE_ID: trade.id,
  };

  await emailQueue.add({ emailData, emailType: "P2PTradeSaleConfirmation" });
}

export async function sendP2POfferAmountDepletionEmail(
  seller,
  offer,
  currentAmount
) {
  const emailData = {
    TO: seller.email,
    SELLER_NAME: seller.firstName,
    OFFER_ID: offer.id.toString(),
    CURRENT_AMOUNT: currentAmount.toString(),
    CURRENCY: offer.currency,
  };

  await emailQueue.add({ emailData, emailType: "P2POfferAmountDepletion" });
}

export async function sendP2PTradeReplyEmail(receiver, sender, trade, message) {
  const emailData = {
    TO: receiver.email,
    RECEIVER_NAME: receiver.firstName,
    SENDER_NAME: sender.firstName,
    TRADE_ID: trade.id,
    MESSAGE: message.text,
  };

  await emailQueue.add({ emailData, emailType: "P2PTradeReply" });
}

export async function sendP2PTradeCancellationEmail(participant, trade) {
  const emailData = {
    TO: participant.email,
    PARTICIPANT_NAME: participant.firstName,
    TRADE_ID: trade.id,
  };

  await emailQueue.add({ emailData, emailType: "P2PTradeCancellation" });
}

export async function sendP2PTradePaymentConfirmationEmail(
  seller,
  buyer,
  trade,
  transactionId
) {
  const emailData = {
    TO: seller.email,
    SELLER_NAME: seller.firstName,
    BUYER_NAME: buyer.firstName,
    TRADE_ID: trade.id,
    TRANSACTION_ID: transactionId,
  };

  await emailQueue.add({ emailData, emailType: "P2PTradePaymentConfirmation" });
}

export async function sendP2PDisputeOpenedEmail(
  disputed,
  disputer,
  trade,
  disputeReason
) {
  const emailData = {
    TO: disputed.email,
    PARTICIPANT_NAME: disputed.firstName,
    OTHER_PARTY_NAME: disputer.firstName,
    TRADE_ID: trade.id,
    DISPUTE_REASON: disputeReason,
  };

  await emailQueue.add({ emailData, emailType: "P2PDisputeOpened" });
}

export async function sendP2PDisputeClosingEmail(participant, trade) {
  const emailData = {
    TO: participant.email,
    PARTICIPANT_NAME: participant.firstName,
    TRADE_ID: trade.id,
  };

  await emailQueue.add({ emailData, emailType: "P2PDisputeClosing" });
}

export async function sendP2PTradeCompletionEmail(seller, buyer, trade) {
  const emailData = {
    TO: seller.email,
    SELLER_NAME: seller.firstName,
    BUYER_NAME: buyer.firstName,
    AMOUNT: trade.amount.toString(),
    CURRENCY: trade.offer.currency,
    TRADE_ID: trade.id,
  };

  await emailQueue.add({ emailData, emailType: "P2PTradeCompletion" });
}

export async function sendP2PReviewNotificationEmail(
  seller,
  reviewer,
  offer,
  rating,
  comment
) {
  const emailData = {
    TO: seller.email,
    SELLER_NAME: seller.firstName,
    OFFER_ID: offer.id,
    REVIEWER_NAME: reviewer.firstName,
    RATING: rating.toString(),
    COMMENT: comment,
  };

  await emailQueue.add({ emailData, emailType: "P2PReviewNotification" });
}
