import {
  getRecord,
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { baseMlmReferralSchema } from "../utils";
import { models } from "@b/db";

export const metadata: OperationObject = {
  summary: "Retrieves detailed information of a specific MLM Referral by ID",
  operationId: "getMlmReferralById",
  tags: ["Admin", "MLM", "Referrals"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the MLM Referral to retrieve",
      schema: { type: "string" },
    },
  ],
  responses: {
    200: {
      description: "MLM Referral details",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: baseMlmReferralSchema,
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("MLM Referral"),
    500: serverErrorResponse,
  },
  permission: "Access MLM Referral Management",
  requiresAuth: true,
};

export default async (data) => {
  const { params } = data;

  return await getRecord("mlmReferral", params.id, [
    {
      model: models.user,
      as: "referrer",
      attributes: ["firstName", "lastName", "email", "avatar"],
    },
    {
      model: models.user,
      as: "referred",
      attributes: ["firstName", "lastName", "email", "avatar"],
    },
  ]);
};
