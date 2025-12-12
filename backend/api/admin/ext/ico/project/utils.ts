import {
  baseStringSchema,
  baseDateTimeSchema,
  baseEnumSchema,
} from "@b/utils/schema";

const id = baseStringSchema("ID of the ICO Project");
const name = baseStringSchema("Name of the ICO Project");
const description = baseStringSchema("Description of the ICO Project", 5000);
const website = baseStringSchema("Website URL of the ICO Project");
const whitepaper = baseStringSchema("Whitepaper of the ICO Project", 5000);
const image = baseStringSchema("Image URL of the ICO Project");
const status = baseEnumSchema("Current status of the project", [
  "PENDING",
  "ACTIVE",
  "COMPLETED",
  "REJECTED",
  "CANCELLED",
]);
const createdAt = baseDateTimeSchema("Creation Date of the Project");
const updatedAt = baseDateTimeSchema("Last Update Date of the Project", true);
const deletedAt = baseDateTimeSchema("Deletion Date of the Project", true);

export const icoProjectSchema = {
  id,
  name,
  description,
  website,
  whitepaper,
  image,
  status,
  createdAt,
  updatedAt,
  deletedAt,
};

export const baseIcoProjectSchema = {
  id,
  name,
  description,
  website,
  whitepaper,
  image,
  status,
  createdAt,
  updatedAt,
  deletedAt,
};

export const icoProjectUpdateSchema = {
  type: "object",
  properties: {
    name,
    description,
    website,
    whitepaper,
    image,
    status,
  },
  required: ["name", "description", "website", "whitepaper", "image", "status"],
};

export const icoProjectStoreSchema = {
  description: `ICO Project created or updated successfully`,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: baseIcoProjectSchema,
      },
    },
  },
};
