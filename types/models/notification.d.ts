


interface notificationAttributes {
  id: string;
  userId: string;
  type: "SECURITY" | "SYSTEM" | "ACTIVITY";
  title: string;
  message: string;
  link?: string;
  icon?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type notificationPk = "id";
type notificationId = notification[notificationPk];
type notificationOptionalAttributes =
  | "id"
  | "type"
  | "link"
  | "icon"
  | "createdAt"
  | "updatedAt";
type notificationCreationAttributes = Optional<
  notificationAttributes,
  notificationOptionalAttributes
>;
