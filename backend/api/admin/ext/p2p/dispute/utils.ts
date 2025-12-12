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
    status: {
      type: "string",
      description: "Dispute status",
      enum: ["PENDING", "OPEN", "RESOLVED", "CANCELLED"],
    },
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

export async function sendP2PDisputeResolutionEmail(
  participant,
  trade,
  resolutionMessage
) {
  const emailData = {
    TO: participant.email,
    PARTICIPANT_NAME: participant.firstName,
    TRADE_ID: trade.id,
    RESOLUTION_MESSAGE: resolutionMessage,
  };

  await emailQueue.add({ emailData, emailType: "P2PDisputeResolution" });
}

export async function sendP2PDisputeResolvingEmail(participant, trade) {
  const emailData = {
    TO: participant.email,
    PARTICIPANT_NAME: participant.firstName,
    TRADE_ID: trade.id,
  };

  await emailQueue.add({ emailData, emailType: "P2PDisputeResolving" });
}

export async function sendP2PDisputeClosingEmail(participant, trade) {
  const emailData = {
    TO: participant.email,
    PARTICIPANT_NAME: participant.firstName,
    TRADE_ID: trade.id,
  };

  await emailQueue.add({ emailData, emailType: "P2PDisputeClosing" });
}
