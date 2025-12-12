import { baseDateTimeSchema, baseStringSchema } from "@b/utils/schema";

// Existing fields
const id = baseStringSchema("ID of the API key");
const userId = baseStringSchema("User ID associated with the API key");
const key = baseStringSchema("The API key string");
const createdAt = baseDateTimeSchema("Creation date of the API key");
const updatedAt = baseDateTimeSchema("Last update date of the API key", true);
const deletedAt = baseDateTimeSchema("Deletion date of the API key", true);

// New fields
const name = baseStringSchema("Name of the API key");
const type = {
  type: "string",
  enum: ["plugin", "user"],
  description: "Type of the API key (e.g., plugin, user)",
};
const permissions = {
  type: "array",
  items: { type: "string" },
  description: "Permissions associated with the API key",
};
const ipWhitelist = {
  type: "array",
  items: { type: "string" },
  description: "IP addresses whitelisted for the API key",
};
const ipRestriction = {
  type: "boolean",
  description: "Whether IP restriction is enabled for the API key",
};

// Updated schema
export const apiKeySchema = {
  id: id,
  userId: userId,
  name: name,
  type: type, // Added type field
  key: key,
  permissions: permissions,
  ipWhitelist: ipWhitelist,
  ipRestriction: ipRestriction,
  createdAt: createdAt,
  updatedAt: updatedAt,
  deletedAt: deletedAt,
};

// Updated schema for API key creation
export const apiKeyStoreSchema = {
  type: "object",
  properties: {
    userId: userId,
    name: name,
    type: type, // Include type in creation
    permissions: permissions,
    ipWhitelist: ipWhitelist,
    ipRestriction: ipRestriction,
  },
  required: ["userId", "name", "type"], // Fields required for creating a new API key
};

// Updated schema for API key updates
export const apiKeyUpdateSchema = {
  type: "object",
  properties: {
    name: name, // Allow updating name
    type: type, // Allow updating type
    permissions: permissions, // Allow updating permissions
    ipWhitelist: ipWhitelist, // Allow updating IP whitelist
    ipRestriction: ipRestriction, // Allow updating IP restriction
  },
  required: ["type"], // At least type is required for updates
};
