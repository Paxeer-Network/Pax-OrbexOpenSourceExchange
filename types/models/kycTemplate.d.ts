


interface kycTemplateAttributes {
  id: string;
  title: string;
  options?: string;
  customOptions?: string;
  status?: boolean;
}

type kycTemplatePk = "id";
type kycTemplateId = kycTemplate[kycTemplatePk];
type kycTemplateOptionalAttributes = "id" | "options" | "status";
type kycTemplateCreationAttributes = Optional<
  kycTemplateAttributes,
  kycTemplateOptionalAttributes
>;
