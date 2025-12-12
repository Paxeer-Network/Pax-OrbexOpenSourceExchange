import { emailQueue } from "@b/utils/emails";
import {
  baseStringSchema,
  baseDateTimeSchema,
  baseEnumSchema,
} from "@b/utils/schema";

const id = baseStringSchema("ID of the P2P Dispute");
const tradeId = baseStringSchema("Trade ID associated with the dispute");
const raisedById = baseStringSchema(
  "User ID of the person who raised the dispute"
);
const reason = baseStringSchema("Reason for the dispute");
const status = baseEnumSchema("Current status of the dispute", [
  "PENDING",
  "OPEN",
  "RESOLVED",
  "CANCELLED",
]);
const resolution = baseStringSchema(
  "Resolution details, if resolved",
  191,
  0,
  true
);
const createdAt = baseDateTimeSchema("Creation date of the P2P Dispute");
const updatedAt = baseDateTimeSchema(
  "Last update date of the P2P Dispute",
  true
);

export const p2pDisputeSchema = {
  id,
  tradeId,
  raisedById,
  reason,
  status,
  resolution,
  createdAt,
  updatedAt,
};

export const baseP2pDisputeSchema = {
  id,
  tradeId,
  raisedById,
  reason,
  status,
  resolution,
  createdAt,
  updatedAt,
  deletedAt: baseDateTimeSchema("Deletion date of the P2P Dispute, if any"),
};

export const p2pDisputeUpdateSchema = {
  type: "object",
  properties: {
    status: baseEnumSchema(
      ["PENDING", "OPEN", "RESOLVED", "CANCELLED"],
      "Dispute status"
    ),
    resolution: baseStringSchema("Resolution details"),
  },
  required: ["status"],
};

export const p2pDisputeStoreSchema = {
  description: `P2P Dispute created or updated successfully`,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: baseP2pDisputeSchema,
      },
    },
  },
};

export async function sendP2PDisputeOpenedEmail(
  disputed,
  disputer,
  trade,
  disputeReason
) {
  const emailData = {
    TO: disputed.email,
    PARTICIPANT_NAME: disputed.first_name,
    OTHER_PARTY_NAME: disputer.first_name,
    TRADE_ID: trade.id,
    DISPUTE_REASON: disputeReason,
  };

  await emailQueue.add({ emailData, emailType: "P2PDisputeOpened" });
}
