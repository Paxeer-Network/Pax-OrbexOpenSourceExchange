


interface roleAttributes {
  id: number;
  name: string;
}

type rolePk = "id";
type roleId = role[rolePk];
type roleOptionalAttributes = "id";
type roleCreationAttributes = Optional<
  roleAttributes,
  roleOptionalAttributes
>;
