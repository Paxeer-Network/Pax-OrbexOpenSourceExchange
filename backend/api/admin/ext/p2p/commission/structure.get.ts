// /api/p2pCommissions/structure.get.ts

import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for P2P Commissions",
  operationId: "getP2pCommissionStructure",
  tags: ["Admin","P2P Commissions"],
  responses: {
    200: {
      description: "Form structure for managing P2P Commissions",
      content: structureSchema,
    },
  },
  permission: "Access P2P Commission Management"
};

export const p2pCommissionStructure = () => {
  const tradeId = {
    type: "input",
    label: "Trade ID",
    name: "tradeId",
    placeholder: "Enter the associated trade ID",
  };

  const amount = {
    type: "input",
    label: "Commission Amount",
    name: "amount",
    placeholder: "Enter the commission amount",
    ts: "number",
  };

  return {
    tradeId,
    amount,
  };
};

export default (): object => {
  const { tradeId, amount } = p2pCommissionStructure();

  return {
    get: [tradeId, amount],
    set: [tradeId, amount],
  };
};
