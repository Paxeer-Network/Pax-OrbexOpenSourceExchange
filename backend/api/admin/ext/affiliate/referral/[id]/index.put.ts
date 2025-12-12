import { updateRecord, updateRecordResponses } from "@b/utils/query";
import { mlmReferralUpdateSchema } from "../utils";
import { models } from "@b/db";

export const metadata: OperationObject = {
  summary: "Updates a specific MLM Referral",
  operationId: "updateMlmReferral",
  tags: ["Admin", "MLM Referrals"],
  parameters: [
    {
      name: "id",
      in: "path",
      description: "ID of the MLM Referral to update",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    description: "New data for the MLM Referral",
    content: {
      "application/json": {
        schema: mlmReferralUpdateSchema,
      },
    },
  },
  responses: updateRecordResponses("MLM Referral"),
  requiresAuth: true,
  permission: "Access MLM Referral Management",
};

export default async (data) => {
  const { body, params } = data;
  const { id } = params;
  const { status, referrerId, referredId } = body;

  if (referrerId === referredId)
    throw new Error("Referrer and referred user cannot be the same");

  const referrer = await models.user.findOne({ where: { id: referrerId } });
  if (!referrer) throw new Error("Referrer not found");

  const referred = await models.user.findOne({ where: { id: referredId } });
  if (!referred) throw new Error("Referred user not found");

  return await updateRecord("mlmReferral", id, {
    status,
    referrerId,
    referredId,
  });
};
