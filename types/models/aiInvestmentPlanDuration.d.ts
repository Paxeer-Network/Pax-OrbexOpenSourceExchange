


interface aiInvestmentPlanDurationAttributes {
  id: string;
  planId: string;
  durationId: string;
}

type aiInvestmentPlanDurationPk = "id";
type aiInvestmentPlanDurationId =
  aiInvestmentPlanDuration[aiInvestmentPlanDurationPk];
type aiInvestmentPlanDurationOptionalAttributes = "id";
type aiInvestmentPlanDurationCreationAttributes = Optional<
  aiInvestmentPlanDurationAttributes,
  aiInvestmentPlanDurationOptionalAttributes
>;
