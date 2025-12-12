


interface investmentPlanDurationAttributes {
  id: string;
  planId: string;
  durationId: string;
}

type investmentPlanDurationPk = "id";
type investmentPlanDurationId =
  investmentPlanDuration[investmentPlanDurationPk];
type investmentPlanDurationOptionalAttributes = "id";
type investmentPlanDurationCreationAttributes = Optional<
  investmentPlanDurationAttributes,
  investmentPlanDurationOptionalAttributes
>;
