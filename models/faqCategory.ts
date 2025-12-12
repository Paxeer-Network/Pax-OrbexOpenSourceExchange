import * as Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";
import faq from "./faq";

export default class faqCategory
  extends Model<faqCategoryAttributes, faqCategoryCreationAttributes>
  implements faqCategoryAttributes
{
  id!: string;

  // faqCategory hasMany faq via faqCategoryId
  faqs!: faq[];
  getFaqs!: Sequelize.HasManyGetAssociationsMixin<faq>;
  setFaqs!: Sequelize.HasManySetAssociationsMixin<faq, faqId>;
  addFaq!: Sequelize.HasManyAddAssociationMixin<faq, faqId>;
  addFaqs!: Sequelize.HasManyAddAssociationsMixin<faq, faqId>;
  createFaq!: Sequelize.HasManyCreateAssociationMixin<faq>;
  removeFaq!: Sequelize.HasManyRemoveAssociationMixin<faq, faqId>;
  removeFaqs!: Sequelize.HasManyRemoveAssociationsMixin<faq, faqId>;
  hasFaq!: Sequelize.HasManyHasAssociationMixin<faq, faqId>;
  hasFaqs!: Sequelize.HasManyHasAssociationsMixin<faq, faqId>;
  countFaqs!: Sequelize.HasManyCountAssociationsMixin;

  public static initModel(sequelize: Sequelize.Sequelize): typeof faqCategory {
    return faqCategory.init(
      {
        id: {
          type: DataTypes.STRING(191),
          allowNull: false,
          primaryKey: true,
        },
      },
      {
        sequelize,
        modelName: "faqCategory",
        tableName: "faq_category",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
        ],
      }
    );
  }
  public static associate(models: any) {
    faqCategory.hasMany(models.faq, {
      as: "faqs",
      foreignKey: "faqCategoryId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}
