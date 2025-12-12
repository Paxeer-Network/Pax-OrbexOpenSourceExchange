import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for API Keys",
  operationId: "getAPIKeyStructure",
  tags: ["Admin", "API Keys"],
  responses: {
    200: {
      description: "Form structure for managing API Keys",
      content: structureSchema,
    },
  },
  permission: "Access API Key Management",
};

export const apiKeyStructure = async () => {
  const id = {
    type: "input",
    label: "ID",
    name: "id",
    placeholder: "Automatically generated",
    readOnly: true,
  };

  const name = {
    type: "input",
    label: "Name",
    name: "name",
    placeholder: "Enter the name of the API",
  };

  const userId = {
    type: "input",
    label: "User",
    name: "userId",
    placeholder: "Enter the user ID",
    icon: "lets-icons:user-duotone",
  };

  const key = {
    type: "input",
    label: "API Key",
    name: "key",
    placeholder: "Enter the API key",
    readOnly: true,
  };

  const type = {
    type: "select",
    label: "Type",
    name: "type",
    options: [
      { label: "Plugin", value: "plugin" },
      { label: "User", value: "user" },
    ],
    placeholder: "Select the type of the API key",
  };

  const permissionIds = {
    type: "tags",
    label: "Permissions",
    name: "permissions",
    key: "permissions",
    options: [
      { name: "Trade", id: "trade" },
      { name: "Futures", id: "futures" },
      { name: "Deposit", id: "deposit" },
      { name: "Withdraw", id: "withdraw" },
      { name: "Transfer", id: "transfer" },
      { name: "Payment", id: "payment" },
    ],
  };

  const ipWhitelist = {
    type: "textarea",
    label: "IP Whitelist",
    name: "ipWhitelist",
    placeholder: "Enter allowed IP addresses, one per line",
  };

  const ipRestriction = {
    type: "switch",
    label: "IP Restriction",
    name: "ipRestriction",
    placeholder: "Enable or disable IP restriction",
  };

  return {
    id,
    name,
    userId,
    key,
    type,
    permissionIds,
    ipWhitelist,
    ipRestriction,
  };
};

export default async (): Promise<object> => {
  const {
    id,
    name,
    userId,
    key,
    type,
    permissionIds,
    ipWhitelist,
    ipRestriction,
  } = await apiKeyStructure();

  const permissions = {
    type: "tags",
    label: "Permissions",
    name: "permissions",
    key: "permissions",
  };

  return {
    get: [id, userId, key, type, permissions, ipWhitelist, ipRestriction],
    set: [name, userId, type, permissionIds, ipWhitelist, ipRestriction],
  };
};
