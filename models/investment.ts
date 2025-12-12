import * as Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";
import investmentDuration from "./investmentDuration";
import investmentPlan from "./investmentPlan";
import user from "./user";

export default class investment
  extends Model<investmentAttributes, investmentCreationAttributes>
  implements investmentAttributes
{
  id!: string;
  userId: string;
  planId: string;
  durationId: string;
  amount: number;
  profit?: number;
  result?: "WIN" | "LOSS" | "DRAW";
  status!: "ACTIVE" | "COMPLETED" | "CANCELLED" | "REJECTED";
  endDate?: Date;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // investment belongsTo investmentDuration via durationId
  duration!: investmentDuration;
  getDuration!: Sequelize.BelongsToGetAssociationMixin<investmentDuration>;
  setDuration!: Sequelize.BelongsToSetAssociationMixin<
    investmentDuration,
    investmentDurationId
  >;
  createDuration!: Sequelize.BelongsToCreateAssociationMixin<investmentDuration>;
  // investment belongsTo investmentPlan via planId
  plan!: investmentPlan;
  getPlan!: Sequelize.BelongsToGetAssociationMixin<investmentPlan>;
  setPlan!: Sequelize.BelongsToSetAssociationMixin<
    investmentPlan,
    investmentPlanId
  >;
  createPlan!: Sequelize.BelongsToCreateAssociationMixin<investmentPlan>;
  // investment belongsTo user via userId
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  public static initModel(sequelize: Sequelize.Sequelize): typeof investment {
    return investment.init(
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
        planId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: { args: 4, msg: "planId: Plan ID must be a valid UUID" },
          },
        },
        durationId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: {
              args: 4,
              msg: "durationId: Duration ID must be a valid UUID",
            },
          },
        },
        amount: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isFloat: { msg: "amount: Amount must be a number" },
          },
        },
        profit: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          validate: {
            isFloat: { msg: "profit: Profit must be a number" },
          },
        },
        result: {
          type: DataTypes.ENUM("WIN", "LOSS", "DRAW"),
          allowNull: true,
          validate: {
            isIn: {
              args: [["WIN", "LOSS", "DRAW"]],
              msg: "result: Result must be WIN, LOSS, or DRAW",
            },
          },
        },
        status: {
          type: DataTypes.ENUM("ACTIVE", "COMPLETED", "CANCELLED", "REJECTED"),
          allowNull: false,
          defaultValue: "ACTIVE",
          validate: {
            isIn: {
              args: [["ACTIVE", "COMPLETED", "CANCELLED", "REJECTED"]],
              msg: "status: Status must be ACTIVE, COMPLETED, CANCELLED, or REJECTED",
            },
          },
        },
        endDate: {
          type: DataTypes.DATE(3),
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "investment",
        tableName: "investment",
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
            name: "investmentIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "investmentUserIdFkey",
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
          {
            name: "investmentPlanIdFkey",
            using: "BTREE",
            fields: [{ name: "planId" }],
          },
          {
            name: "investmentDurationIdFkey",
            using: "BTREE",
            fields: [{ name: "durationId" }],
          },
          {
            name: "investmentUserIdPlanIdStatusUnique",
            unique: true,
            using: "BTREE",
            fields: ["userId", "planId", "status"],
            where: {
              status: "ACTIVE",
            },
          },
        ],
      }
    );
  }
  public static associate(models: any) {
    investment.belongsTo(models.investmentPlan, {
      as: "plan",
      foreignKey: "planId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    investment.belongsTo(models.investmentDuration, {
      as: "duration",
      foreignKey: "durationId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    investment.belongsTo(models.user, {
      as: "user",
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}
