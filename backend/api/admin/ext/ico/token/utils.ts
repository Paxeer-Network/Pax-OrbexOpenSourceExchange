import {
  baseStringSchema,
  baseDateTimeSchema,
  baseEnumSchema,
  baseNumberSchema,
} from "@b/utils/schema";

const id = baseStringSchema("ID of the ICO Token");
const name = baseStringSchema("Name of the ICO Token");
const chain = baseStringSchema("Blockchain Chain for the ICO Token");
const currency = baseStringSchema("Currency type of the ICO Token");
const purchaseCurrency = baseStringSchema(
  "Currency used to purchase the ICO Token"
);
const purchaseWalletType = baseEnumSchema(
  "Type of wallet used for purchasing the ICO Token",
  ["FIAT", "SPOT", "ECO"]
);
const address = baseStringSchema("Blockchain address of the ICO Token");
const totalSupply = baseNumberSchema("Total supply of the ICO Token");
const description = {
  type: "string",
  description: "Description of the ICO Token",
};
const image = baseStringSchema("Image URL of the ICO Token");
const status = baseEnumSchema("Current status of the ICO Token", [
  "PENDING",
  "ACTIVE",
  "COMPLETED",
  "REJECTED",
  "CANCELLED",
]);
const createdAt = baseDateTimeSchema("Creation Date of the ICO Token");
const updatedAt = baseDateTimeSchema("Last Update Date of the ICO Token", true);
const projectId = baseStringSchema("ID of the related ICO Project");

export const icoTokenSchema = {
  id,
  name,
  chain,
  currency,
  purchaseCurrency,
  purchaseWalletType,
  address,
  totalSupply,
  description,
  image,
  status,
  createdAt,
  updatedAt,
  projectId,
};

export const baseIcoTokenSchema = {
  id,
  name,
  chain,
  currency,
  purchaseCurrency,
  purchaseWalletType,
  address,
  totalSupply,
  description,
  image,
  status,
  projectId,
  createdAt,
  updatedAt,
};

export const icoTokenUpdateSchema = {
  type: "object",
  properties: {
    name,
    chain,
    currency,
    purchaseCurrency,
    purchaseWalletType,
    address,
    totalSupply,
    description,
    image,
    status,
    projectId,
  },
  required: [
    "name",
    "chain",
    "currency",
    "purchaseCurrency",
    "purchaseWalletType",
    "address",
    "totalSupply",
    "description",
    "image",
    "status",
    "projectId",
  ],
};

export const icoTokenStoreSchema = {
  description: `ICO Token created or updated successfully`,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: baseIcoTokenSchema,
      },
    },
  },
};
