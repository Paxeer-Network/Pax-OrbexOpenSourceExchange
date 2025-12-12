import * as Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";
import icoPhase from "./icoPhase";
import user from "./user";

export default class icoContribution
  extends Model<icoContributionAttributes, icoContributionCreationAttributes>
  implements icoContributionAttributes
{
  id!: string;
  userId!: string;
  phaseId!: string;
  amount!: number;
  status!: "PENDING" | "COMPLETED" | "CANCELLED" | "REJECTED";
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // icoContribution belongsTo icoPhase via phaseId
  phase!: icoPhase;
  getPhase!: Sequelize.BelongsToGetAssociationMixin<icoPhase>;
  setPhase!: Sequelize.BelongsToSetAssociationMixin<icoPhase, icoPhaseId>;
  createPhase!: Sequelize.BelongsToCreateAssociationMixin<icoPhase>;
  // icoContribution belongsTo user via userId
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  public static initModel(sequelize: Sequelize.Sequelize): typeof icoContribution {
    return icoContribution.init(
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

          validate: {
            notNull: { msg: "userId: User ID cannot be null" },
            isUUID: { args: 4, msg: "userId: User ID must be a valid UUID" },
          },
        },
        phaseId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: { args: 4, msg: "phaseId: Phase ID must be a valid UUID" },
          },
        },
        amount: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isFloat: { msg: "amount: Amount must be a valid number" },
          },
        },
        status: {
          type: DataTypes.ENUM("PENDING", "COMPLETED", "CANCELLED", "REJECTED"),
          allowNull: false,
          defaultValue: "PENDING",
          validate: {
            isIn: {
              args: [["PENDING", "COMPLETED", "CANCELLED", "REJECTED"]],
              msg: "status: Status must be PENDING, COMPLETED, CANCELLED, or REJECTED",
            },
          },
        },
      },
      {
        sequelize,
        modelName: "icoContribution",
        tableName: "ico_contribution",
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
            name: "icoContributionIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "icoContributionUserIdFkey",
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
          {
            name: "icoContributionPhaseIdFkey",
            using: "BTREE",
            fields: [{ name: "phaseId" }],
          },
        ],
      }
    );
  }
  public static associate(models: any) {
    icoContribution.belongsTo(models.icoPhase, {
      as: "phase",
      foreignKey: "phaseId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    icoContribution.belongsTo(models.user, {
      as: "user",
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}
