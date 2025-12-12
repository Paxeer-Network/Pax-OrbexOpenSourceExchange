// /api/forexSignals/structure.get.ts

import { structureSchema } from "@b/utils/constants";
import { imageStructure } from "@b/utils/schema/structure";

export const metadata = {
  summary: "Get form structure for Forex Signals",
  operationId: "getForexSignalStructure",
  tags: ["Admin", "Forex Signals"],
  responses: {
    200: {
      description: "Form structure for managing Forex Signals",
      content: structureSchema,
    },
  },
  permission: "Access Forex Signal Management",
};

export const forexSignalStructure = () => {
  const title = {
    type: "input",
    label: "Title",
    name: "title",
    component: "InfoBlock",
    icon: "material-symbols-light:title",
    placeholder: "Enter the title of the signal",
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
    ts: "boolean",
  };

  return {
    title,
    status,
  };
};

export default (): object => {
  const { title, status } = forexSignalStructure();

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
            fields: [title],
            grid: "column",
          },
        ],
        className: "card-dashed mb-3 items-center",
      },
      status,
    ],
    set: [imageStructure, title, status],
  };
};
