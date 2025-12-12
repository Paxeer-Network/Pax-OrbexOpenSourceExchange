// /api/p2pPaymentMethods/structure.get.ts

import { structureSchema } from "@b/utils/constants";
import { imageStructure } from "@b/utils/schema/structure";
import { CacheManager } from "@b/utils/cache";

export const metadata = {
  summary: "Get form structure for P2P Payment Methods",
  operationId: "getP2pPaymentMethodStructure",
  tags: ["Admin", "P2P Payment Methods"],
  responses: {
    200: {
      description: "Form structure for managing P2P Payment Methods",
      content: structureSchema,
    },
  },
  permission: "Access P2P Payment Method Management",
};

export const p2pPaymentMethodStructure = async () => {
  const userId = {
    type: "input",
    label: "User",
    name: "userId",
    placeholder: "Enter the user ID",
    icon: "lets-icons:user-duotone",
  };

  const name = {
    type: "input",
    label: "Name",
    name: "name",
    component: "InfoBlock",
    icon: "material-symbols-light:title",
    placeholder: "Enter the name of the payment method",
  };

  const instructions = {
    type: "textarea",
    label: "Instructions",
    name: "instructions",
    placeholder: "Detailed instructions on how to use this payment method",
  };

  const walletType = {
    type: "select",
    label: "Wallet Type",
    name: "walletType",
    options: [
      { value: "FIAT", label: "Fiat" },
      { value: "SPOT", label: "Spot" },
    ],
    placeholder: "Select wallet type",
  };
  const cacheManager = CacheManager.getInstance();
  const extensions = await cacheManager.getExtensions();
  if (extensions.has("ecosystem")) {
    walletType.options.push({ value: "ECO", label: "Funding" });
  }

  const currency = {
    type: "input",
    label: "Currency",
    name: "currency",
    placeholder: "Enter the currency code",
  };

  const status = {
    type: "select",
    label: "Active",
    name: "status",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
    ts: "boolean",
  };

  return {
    userId,
    name,
    instructions,
    currency,
    status,
  };
};

export default async () => {
  const { userId, name, instructions, currency, status } =
    await p2pPaymentMethodStructure();

  return {
    get: [
      {
        fields: [
          {
            ...imageStructure,
            width: imageStructure.width / 4,
            height: imageStructure.width / 4,
          },
          {
            fields: [name, currency],
            grid: "column",
          },
        ],
        className: "card-dashed mb-3 items-center",
      },
      userId,
      instructions,
      status,
    ],
    set: [imageStructure, userId, [name, currency], instructions, status],
  };
};
