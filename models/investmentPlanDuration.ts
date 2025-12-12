import * as Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";
import investmentDuration from "./investmentDuration";
import investmentPlan from "./investmentPlan";

export default class investmentPlanDuration
  extends Model<
    investmentPlanDurationAttributes,
    investmentPlanDurationCreationAttributes
  >
  implements investmentPlanDurationAttributes
{
  id!: string;
  planId!: string;
  durationId!: string;

  // investmentPlanDuration belongsTo investmentDuration via durationId
  duration!: investmentDuration;
  getDuration!: Sequelize.BelongsToGetAssociationMixin<investmentDuration>;
  setDuration!: Sequelize.BelongsToSetAssociationMixin<
    investmentDuration,
    investmentDurationId
  >;
  createDuration!: Sequelize.BelongsToCreateAssociationMixin<investmentDuration>;
  // investmentPlanDuration belongsTo investmentPlan via planId
  plan!: investmentPlan;
  getPlan!: Sequelize.BelongsToGetAssociationMixin<investmentPlan>;
  setPlan!: Sequelize.BelongsToSetAssociationMixin<
    investmentPlan,
    investmentPlanId
  >;
  createPlan!: Sequelize.BelongsToCreateAssociationMixin<investmentPlan>;

  public static initModel(
    sequelize: Sequelize.Sequelize
  ): typeof investmentPlanDuration {
    return investmentPlanDuration.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        planId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        durationId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "investmentPlanDuration",
        tableName: "investment_plan_duration",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "idxPlanId",
            using: "BTREE",
            fields: [{ name: "planId" }],
          },
          {
            name: "idxDurationId",
            using: "BTREE",
            fields: [{ name: "durationId" }],
          },
        ],
      }
    );
  }
  public static associate(models: any) {
    investmentPlanDuration.belongsTo(models.investmentDuration, {
      as: "duration",
      foreignKey: "durationId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    investmentPlanDuration.belongsTo(models.investmentPlan, {
      as: "plan",
      foreignKey: "planId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}
