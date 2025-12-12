


interface forexDurationAttributes {
  id: string;
  duration: number;
  timeframe: "HOUR" | "DAY" | "WEEK" | "MONTH";
}

type forexDurationPk = "id";
type forexDurationId = forexDuration[forexDurationPk];
type forexDurationOptionalAttributes = "id";
type forexDurationCreationAttributes = Optional<
  forexDurationAttributes,
  forexDurationOptionalAttributes
>;
