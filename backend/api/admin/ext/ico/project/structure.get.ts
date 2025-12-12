// /api/icoProjects/structure.get.ts

import { structureSchema } from "@b/utils/constants";
import { imageStructureLg } from "@b/utils/schema/structure";

export const metadata = {
  summary: "Get form structure for ICO Projects",
  operationId: "getIcoProjectStructure",
  tags: ["Admin","ICO Projects"],
  responses: {
    200: {
      description: "Form structure for managing ICO Projects",
      content: structureSchema,
    },
  },
  permission: "Access ICO Project Management"
};

export const icoProjectStructure = () => {
  const name = {
    type: "input",
    label: "Name",
    name: "name",
    placeholder: "Enter the project name",
    component: "InfoBlock",
    icon: "material-symbols-light:title",
  };

  const description = {
    type: "textarea",
    label: "Description",
    name: "description",
    placeholder: "Enter the project description",
  };

  const website = {
    type: "input",
    label: "Website",
    name: "website",
    placeholder: "Enter the project website URL",
    component: "InfoBlock",
    icon: "ph:link",
  };

  const whitepaper = {
    type: "textarea",
    label: "Whitepaper",
    name: "whitepaper",
    placeholder: "Provide the whitepaper text or URL",
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    options: [
      { value: "PENDING", label: "Pending" },
      { value: "ACTIVE", label: "Active" },
      { value: "COMPLETED", label: "Completed" },
      { value: "REJECTED", label: "Rejected" },
      { value: "CANCELLED", label: "Cancelled" },
    ],
    placeholder: "Select the project status",
  };

  return {
    name,
    description,
    website,
    whitepaper,
    status,
  };
};

export default (): object => {
  const { name, description, website, whitepaper, status } =
    icoProjectStructure();

  return {
    get: [
      {
        fields: [
          {
            ...imageStructureLg,
            width: 350,
            height: 262,
          },
          {
            fields: [name, website],
            grid: "column",
          },
        ],
        className: "card-dashed mb-3 items-center",
      },
      description,
      whitepaper,
      status,
    ],
    set: [imageStructureLg, [name, website], description, whitepaper, status],
  };
};
