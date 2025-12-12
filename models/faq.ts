import * as Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";
import faqCategory from "./faqCategory";

export default class faq
  extends Model<faqAttributes, faqCreationAttributes>
  implements faqAttributes
{
  id!: string;
  faqCategoryId!: string;
  question!: string;
  answer!: string;
  videoUrl?: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // faq belongsTo faqCategory via faqCategoryId
  faqCategory!: faqCategory;
  getFaqCategory!: Sequelize.BelongsToGetAssociationMixin<faqCategory>;
  setFaqCategory!: Sequelize.BelongsToSetAssociationMixin<
    faqCategory,
    faqCategoryId
  >;
  createFaqCategory!: Sequelize.BelongsToCreateAssociationMixin<faqCategory>;

  public static initModel(sequelize: Sequelize.Sequelize): typeof faq {
    return faq.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        faqCategoryId: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notNull: { msg: "faqCategoryId: FAQ Category ID cannot be null" },
          },
        },
        question: {
          type: DataTypes.TEXT("long"),
          allowNull: false,
          validate: {
            notEmpty: { msg: "question: Question must not be empty" },
          },
        },
        answer: {
          type: DataTypes.TEXT("long"),
          allowNull: false,
          validate: {
            notEmpty: { msg: "answer: Answer must not be empty" },
          },
        },
        videoUrl: {
          type: DataTypes.TEXT("long"),
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "faq",
        tableName: "faq",
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "faqCategoryId",
            using: "BTREE",
            fields: [{ name: "faqCategoryId" }],
          },
        ],
      }
    );
  }
  public static associate(models: any) {
    faq.belongsTo(models.faqCategory, {
      as: "faqCategory",
      foreignKey: "faqCategoryId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}
