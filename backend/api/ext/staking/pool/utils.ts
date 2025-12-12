import { baseNumberSchema, baseStringSchema } from "@b/utils/schema";

export const baseStakingPoolSchema = {
  id: baseStringSchema("Staking pool ID"),
  name: baseStringSchema("Pool name"),
  status: baseStringSchema("Status of the pool"),
  durations: {
    type: "array",
    items: {
      type: "object",
      properties: {
        id: baseStringSchema("Duration ID"),
        duration: baseNumberSchema("Duration in days"),
        interestRate: baseNumberSchema("Interest rate"),
      },
    },
    description: "Staking durations associated with the pool",
  },
};
