


interface forexPlanDurationAttributes {
  id: string;
  planId: string;
  durationId: string;
}

type forexPlanDurationPk = "id";
type forexPlanDurationId = forexPlanDuration[forexPlanDurationPk];
type forexPlanDurationOptionalAttributes = "id";
type forexPlanDurationCreationAttributes = Optional<
  forexPlanDurationAttributes,
  forexPlanDurationOptionalAttributes
>;
