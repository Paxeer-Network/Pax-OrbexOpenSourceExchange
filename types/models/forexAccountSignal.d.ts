


interface forexAccountSignalAttributes {
  forexAccountId: string;
  forexSignalId: string;
}

type forexAccountSignalPk = "forexAccountId" | "forexSignalId";
type forexAccountSignalId = forexAccountSignal[forexAccountSignalPk];
type forexAccountSignalCreationAttributes = forexAccountSignalAttributes;
