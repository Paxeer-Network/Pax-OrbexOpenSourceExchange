import { emailQueue } from "@b/utils/emails";
import {
  baseStringSchema,
  baseDateTimeSchema,
  baseNumberSchema,
  baseEnumSchema,
} from "@b/utils/schema";

const id = baseStringSchema("ID of the ICO Contribution");
const userId = baseStringSchema("ID of the User");
const phaseId = baseStringSchema("ID of the ICO Phase");
const amount = baseNumberSchema("Amount contributed");
const status = baseEnumSchema("Status of the contribution", [
  "PENDING",
  "COMPLETED",
  "CANCELLED",
  "REJECTED",
]);
const createdAt = baseDateTimeSchema("Creation Date of the Contribution");
const updatedAt = baseDateTimeSchema(
  "Last Update Date of the Contribution",
  true
);
const deletedAt = baseDateTimeSchema("Deletion Date of the Contribution", true);

export const icoContributionSchema = {
  id,
  userId,
  phaseId,
  amount,
  status,
  createdAt,
  updatedAt,
  deletedAt,
};

export const baseIcoContributionSchema = {
  id,
  userId,
  phaseId,
  amount,
  status,
  createdAt,
  updatedAt,
  deletedAt,
};

export const icoContributionUpdateSchema = {
  type: "object",
  properties: {
    userId,
    phaseId,
    amount,
    status,
  },
  required: ["userId", "phaseId", "amount", "status"], // Adjust as necessary based on actual required fields
};

export const icoContributionStoreSchema = {
  description: `ICO Contribution created or updated successfully`,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: baseIcoContributionSchema,
      },
    },
  },
};

export async function sendIcoContributionEmail(
  user: any,
  contribution: any,
  token: any,
  phase: any,
  emailType: "IcoNewContribution" | "IcoContributionPaid",
  transactionId?: string
) {
  const contributionDate = new Date(contribution.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  // Common email data
  const emailData = {
    TO: user.email,
    FIRSTNAME: user.firstName,
    TOKEN_NAME: token.name,
    PHASE_NAME: phase.name,
    AMOUNT: contribution.amount.toString(),
    CURRENCY: token.purchaseCurrency,
    DATE: contributionDate,
  };

  // Customize email data based on the type
  if (emailType === "IcoContributionPaid") {
    emailData["TRANSACTION_ID"] = transactionId || "N/A";
  } else if (emailType === "IcoNewContribution") {
    emailData["CONTRIBUTION_STATUS"] = contribution.status;
  }

  await emailQueue.add({ emailData, emailType });
}
