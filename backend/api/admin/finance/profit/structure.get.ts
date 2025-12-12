import { structureSchema } from "@b/utils/constants";
import { adminProfitStructure } from "./utils";

export const metadata = {
  summary: "Get form structure for Admin Profits",
  operationId: "getAdminProfitStructure",
  tags: ["Admin", "Finance", "Profits"],
  responses: {
    200: {
      description: "Form structure for managing Admin Profits",
      content: structureSchema,
    },
  },
  permission: "Access Admin Profits",
};

export default async (): Promise<object> => {
  const { type, amount, currency, transactionId, description, chain } =
    adminProfitStructure();

  return {
    get: [
      {
        fields: [transactionId, type, amount, currency],
        className: "card-dashed mb-5 items-center",
      },
      description,
      chain,
    ],
    set: [transactionId, type, amount, currency, description, chain],
  };
};
