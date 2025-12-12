// /api/mlmReferrals/structure.get.ts

import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for MLM Referrals",
  operationId: "getMlmReferralStructure",
  tags: ["Admin", "MLM Referrals"],
  responses: {
    200: {
      description: "Form structure for managing MLM Referrals",
      content: structureSchema,
    },
  },
  permission: "Access MLM Referral Management",
};

export const mlmReferralStructure = () => {
  const referrerId = {
    type: "input",
    label: "Referrer ID",
    name: "referrerId",
    placeholder: "Enter the referrer's user ID",
    icon: "lets-icons:user-duotone",
  };

  const referredId = {
    type: "input",
    label: "Referred ID",
    name: "referredId",
    placeholder: "Enter the referred user's ID",
    icon: "lets-icons:user-duotone",
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    options: [
      { value: "PENDING", label: "Pending" },
      { value: "ACTIVE", label: "Active" },
      { value: "REJECTED", label: "Rejected" },
    ],
    placeholder: "Select the referral status",
    required: true,
    icon: "lets-icons:status",
  };

  return {
    referrerId,
    referredId,
    status,
  };
};

export default (): object => {
  const { referrerId, referredId, status } = mlmReferralStructure();

  return {
    get: [referrerId, referredId, status],
    set: [referrerId, referredId, status],
  };
};
