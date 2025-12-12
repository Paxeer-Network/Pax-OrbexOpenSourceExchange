


interface postTagAttributes {
  id: string;
  postId: string;
  tagId: string;
}

type postTagPk = "id";
type postTagId = postTag[postTagPk];
type postTagOptionalAttributes = "id";
type postTagCreationAttributes = Optional<
  postTagAttributes,
  postTagOptionalAttributes
>;
