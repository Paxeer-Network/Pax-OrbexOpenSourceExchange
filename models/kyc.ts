import * as Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";
import kycTemplate from "./kycTemplate";
import user from "./user";

export default class kyc
  extends Model<kycAttributes, kycCreationAttributes>
  implements kycAttributes
{
  id!: string;
  userId!: string;
  templateId!: string;
  data?: string;
  status!: "PENDING" | "APPROVED" | "REJECTED";
  level!: number;
  notes?: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // kyc belongsTo kycTemplate via templateId
  template!: kycTemplate;
  getTemplate!: Sequelize.BelongsToGetAssociationMixin<kycTemplate>;
  setTemplate!: Sequelize.BelongsToSetAssociationMixin<
    kycTemplate,
    kycTemplateId
  >;
  createTemplate!: Sequelize.BelongsToCreateAssociationMixin<kycTemplate>;
  // kyc belongsTo user via userId
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  public static initModel(sequelize: Sequelize.Sequelize): typeof kyc {
    return kyc.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,

          unique: "kycUserIdForeign",
          validate: {
            notNull: { msg: "userId: User ID cannot be null" },
            isUUID: { args: 4, msg: "userId: User ID must be a valid UUID" },
          },
        },
        templateId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: {
              args: 4,
              msg: "templateId: Template ID must be a valid UUID",
            },
          },
        },
        data: {
          type: DataTypes.JSON,
          allowNull: true,
          get() {
            const rawValue = this.getDataValue("data");
            return rawValue ? JSON.parse(rawValue) : null;
          },
        },
        status: {
          type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
          allowNull: false,
          defaultValue: "PENDING",
          validate: {
            isIn: {
              args: [["PENDING", "APPROVED", "REJECTED"]],
              msg: "status: Status must be one of PENDING, APPROVED, REJECTED",
            },
          },
        },
        level: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          validate: {
            isInt: { msg: "level: Level must be an integer" },
          },
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "kyc",
        tableName: "kyc",
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
            name: "kycUserIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
          {
            name: "kycUserIdForeign",
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
          {
            name: "kycTemplateIdForeign",
            using: "BTREE",
            fields: [{ name: "templateId" }],
          },
        ],
      }
    );
  }
  public static associate(models: any) {
    kyc.belongsTo(models.kycTemplate, {
      as: "template",
      foreignKey: "templateId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    kyc.belongsTo(models.user, {
      as: "user",
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}
