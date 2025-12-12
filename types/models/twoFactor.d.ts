


interface twoFactorAttributes {
  id: string;
  userId: string;
  secret: string;
  type: "EMAIL" | "SMS" | "APP";
  enabled: boolean;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

type twoFactorPk = "id";
type twoFactorId = twoFactor[twoFactorPk];
type twoFactorOptionalAttributes =
  | "id"
  | "enabled"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
type twoFactorCreationAttributes = Optional<
  twoFactorAttributes,
  twoFactorOptionalAttributes
>;
