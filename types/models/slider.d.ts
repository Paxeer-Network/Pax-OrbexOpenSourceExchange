


interface sliderAttributes {
  id: string;
  image: string;
  link?: string;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type sliderPk = "id";
type sliderId = slider[sliderPk];
type sliderOptionalAttributes =
  | "id"
  | "link"
  | "status"
  | "createdAt"
  | "updatedAt"
  | "deletedAt";
type sliderCreationAttributes = Optional<
  sliderAttributes,
  sliderOptionalAttributes
>;
