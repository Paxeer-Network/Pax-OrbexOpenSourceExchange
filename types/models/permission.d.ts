


interface permissionAttributes {
  id: number;
  name: string;
}

type permissionPk = "id";
type permissionId = permission[permissionPk];
type permissionOptionalAttributes = "id";
type permissionCreationAttributes = Optional<
  permissionAttributes,
  permissionOptionalAttributes
>;
