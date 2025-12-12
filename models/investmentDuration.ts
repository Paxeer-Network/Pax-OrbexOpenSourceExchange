import * as Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";
import investment from "./investment";
import investmentPlanDuration from "./investmentPlanDuration";

export default class investmentDuration
  extends Model<
    investmentDurationAttributes,
    investmentDurationCreationAttributes
  >
  implements investmentDurationAttributes
{
  id!: string;
  duration!: number;
  timeframe!: "HOUR" | "DAY" | "WEEK" | "MONTH";

  // investmentDuration hasMany investment via durationId
  investments!: investment[];
  getInvestments!: Sequelize.HasManyGetAssociationsMixin<investment>;
  setInvestments!: Sequelize.HasManySetAssociationsMixin<
    investment,
    investmentId
  >;
  addInvestment!: Sequelize.HasManyAddAssociationMixin<
    investment,
    investmentId
  >;
  addInvestments!: Sequelize.HasManyAddAssociationsMixin<
    investment,
    investmentId
  >;
  createInvestment!: Sequelize.HasManyCreateAssociationMixin<investment>;
  removeInvestment!: Sequelize.HasManyRemoveAssociationMixin<
    investment,
    investmentId
  >;
  removeInvestments!: Sequelize.HasManyRemoveAssociationsMixin<
    investment,
    investmentId
  >;
  hasInvestment!: Sequelize.HasManyHasAssociationMixin<
    investment,
    investmentId
  >;
  hasInvestments!: Sequelize.HasManyHasAssociationsMixin<
    investment,
    investmentId
  >;
  countInvestments!: Sequelize.HasManyCountAssociationsMixin;
  // investmentDuration hasMany investmentPlanDuration via durationId
  planDurations!: investmentPlanDuration[];
  getPlanDurations!: Sequelize.HasManyGetAssociationsMixin<investmentPlanDuration>;
  setPlanDurations!: Sequelize.HasManySetAssociationsMixin<
    investmentPlanDuration,
    investmentPlanDurationId
  >;
  addPlanDuration!: Sequelize.HasManyAddAssociationMixin<
    investmentPlanDuration,
    investmentPlanDurationId
  >;
  addPlanDurations!: Sequelize.HasManyAddAssociationsMixin<
    investmentPlanDuration,
    investmentPlanDurationId
  >;
  createPlanDuration!: Sequelize.HasManyCreateAssociationMixin<investmentPlanDuration>;
  removePlanDuration!: Sequelize.HasManyRemoveAssociationMixin<
    investmentPlanDuration,
    investmentPlanDurationId
  >;
  removePlanDurations!: Sequelize.HasManyRemoveAssociationsMixin<
    investmentPlanDuration,
    investmentPlanDurationId
  >;
  hasPlanDuration!: Sequelize.HasManyHasAssociationMixin<
    investmentPlanDuration,
    investmentPlanDurationId
  >;
  hasPlanDurations!: Sequelize.HasManyHasAssociationsMixin<
    investmentPlanDuration,
    investmentPlanDurationId
  >;
  countPlanDurations!: Sequelize.HasManyCountAssociationsMixin;

  public static initModel(sequelize: Sequelize.Sequelize): typeof investmentDuration {
    return investmentDuration.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        duration: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            isInt: { msg: "duration: Duration must be an integer" },
          },
        },
        timeframe: {
          type: DataTypes.ENUM("HOUR", "DAY", "WEEK", "MONTH"),
          allowNull: false,
          validate: {
            isIn: {
              args: [["HOUR", "DAY", "WEEK", "MONTH"]],
              msg: "timeframe: Timeframe must be one of HOUR, DAY, WEEK, MONTH",
            },
          },
        },
      },
      {
        sequelize,
        modelName: "investmentDuration",
        tableName: "investment_duration",
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
    investmentDuration.hasMany(models.investment, {
      as: "investments",
      foreignKey: "durationId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    investmentDuration.hasMany(models.investmentPlanDuration, {
      as: "investmentPlanDurations",
      foreignKey: "durationId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    investmentDuration.belongsToMany(models.investmentPlan, {
      through: models.investmentPlanDuration,
      as: "plans",
      foreignKey: "durationId",
      otherKey: "planId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}
