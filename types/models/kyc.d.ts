


interface kycAttributes {
  id: string;
  userId: string;
  templateId: string;
  data?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  level: number;
  notes?: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

type kycPk = "id";
type kycId = kyc[kycPk];
type kycOptionalAttributes =
  | "id"
  | "data"
  | "status"
  | "level"
  | "notes"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
type kycCreationAttributes = Optional<
  kycAttributes,
  kycOptionalAttributes
>;
