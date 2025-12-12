// /api/p2pDisputes/structure.get.ts

import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for P2P Disputes",
  operationId: "getP2pDisputeStructure",
  tags: ["Admin","P2P Disputes"],
  responses: {
    200: {
      description: "Form structure for managing P2P Disputes",
      content: structureSchema,
    },
  },
  permission: "Access P2P Dispute Management"
};

export const p2pDisputeStructure = () => {
  const tradeId = {
    type: "input",
    label: "Trade ID",
    name: "tradeId",
    placeholder: "Enter the associated trade ID",
  };

  const raisedById = {
    type: "input",
    label: "Raised By ID",
    name: "raisedById",
    placeholder: "Enter the ID of the user who raised the dispute",
  };

  const reason = {
    type: "textarea",
    label: "Reason",
    name: "reason",
    placeholder: "Describe the reason for the dispute",
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    options: [
      { value: "PENDING", label: "Pending" },
      { value: "OPEN", label: "Open" },
      { value: "RESOLVED", label: "Resolved" },
      { value: "CANCELLED", label: "Cancelled" },
    ],
    placeholder: "Select the current status of the dispute",
  };

  const resolution = {
    type: "textarea",
    label: "Resolution",
    name: "resolution",
    placeholder: "Describe the resolution (if applicable)",
  };

  return {
    tradeId,
    raisedById,
    reason,
    status,
    resolution,
  };
};

export default (): object => {
  const { tradeId, raisedById, reason, status, resolution } =
    p2pDisputeStructure();

  return {
    get: [
      {
        fields: [
          {
            type: "file",
            label: "Avatar",
            name: "raisedBy.avatar",
            fileType: "image",
            width: 64,
            height: 64,
            maxSize: 1,
            className: "rounded-full",
            placeholder: "/img/avatars/placeholder.webp",
          },
          {
            fields: [
              {
                type: "input",
                component: "InfoBlock",
                label: "Raised By",
                name: "raisedBy.firstName,' ',raisedBy.lastName",
                icon: "ph:user-circle-light",
              },
            ],
            grid: "column",
          },
        ],
        className: "card-dashed mb-5 items-center",
      },
      tradeId,
      reason,
      resolution,
      status,
    ],
    set: [[raisedById, tradeId], [reason, resolution], status],
  };
};
