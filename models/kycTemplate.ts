import * as Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";
import kyc from "./kyc";

export default class kycTemplate
  extends Model<kycTemplateAttributes, kycTemplateCreationAttributes>
  implements kycTemplateAttributes
{
  id!: string;
  title!: string;
  options?: string;
  customOptions?: string;
  status?: boolean;

  // kycTemplate hasMany kyc via templateId
  kycs!: kyc[];
  getKycs!: Sequelize.HasManyGetAssociationsMixin<kyc>;
  setKycs!: Sequelize.HasManySetAssociationsMixin<kyc, kycId>;
  addKyc!: Sequelize.HasManyAddAssociationMixin<kyc, kycId>;
  addKycs!: Sequelize.HasManyAddAssociationsMixin<kyc, kycId>;
  createKyc!: Sequelize.HasManyCreateAssociationMixin<kyc>;
  removeKyc!: Sequelize.HasManyRemoveAssociationMixin<kyc, kycId>;
  removeKycs!: Sequelize.HasManyRemoveAssociationsMixin<kyc, kycId>;
  hasKyc!: Sequelize.HasManyHasAssociationMixin<kyc, kycId>;
  hasKycs!: Sequelize.HasManyHasAssociationsMixin<kyc, kycId>;
  countKycs!: Sequelize.HasManyCountAssociationsMixin;

  public static initModel(sequelize: Sequelize.Sequelize): typeof kycTemplate {
    return kycTemplate.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING(191),
          allowNull: false,
          unique: "kycTemplateTitleKey",
          validate: {
            notEmpty: { msg: "title: Title cannot be empty" },
          },
        },
        options: {
          type: DataTypes.JSON,
          allowNull: true,
          get() {
            const rawData = this.getDataValue("options");
            return rawData ? JSON.parse(rawData as any) : null;
          },
          set(value) {
            this.setDataValue("options", JSON.stringify(value));
          },
        },
        customOptions: {
          type: DataTypes.JSON,
          allowNull: true,
          get() {
            const rawData = this.getDataValue("customOptions");
            return rawData ? JSON.parse(rawData as any) : null;
          },
          set(value) {
            this.setDataValue("customOptions", JSON.stringify(value));
          },
        },
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
          validate: {
            isBoolean: { msg: "status: Status must be true or false" },
          },
        },
      },
      {
        sequelize,
        modelName: "kycTemplate",
        tableName: "kyc_template",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "kycTemplateTitleKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "title" }],
          },
        ],
      }
    );
  }
  public static associate(models: any) {
    kycTemplate.hasMany(models.kyc, {
      as: "kycs",
      foreignKey: "templateId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}
