import * as Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";
import stakingPool from "./stakingPool";

export default class stakingDuration
  extends Model<stakingDurationAttributes, stakingDurationCreationAttributes>
  implements stakingDurationAttributes
{
  id!: string;
  poolId!: string;
  duration!: number;
  interestRate!: number;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // stakingDuration belongsTo stakingPool via poolId
  pool!: stakingPool;
  getPool!: Sequelize.BelongsToGetAssociationMixin<stakingPool>;
  setPool!: Sequelize.BelongsToSetAssociationMixin<stakingPool, stakingPoolId>;
  createPool!: Sequelize.BelongsToCreateAssociationMixin<stakingPool>;

  public static initModel(sequelize: Sequelize.Sequelize): typeof stakingDuration {
    return stakingDuration.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        poolId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: { args: 4, msg: "poolId: Pool ID must be a valid UUID" },
          },
        },
        duration: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            isInt: { msg: "duration: Duration must be an integer" },
          },
        },
        interestRate: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isFloat: { msg: "interestRate: Interest Rate must be a number" },
          },
        },
      },
      {
        sequelize,
        modelName: "stakingDuration",
        tableName: "staking_duration",
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
            name: "stakingDurationPoolIdFkey",
            using: "BTREE",
            fields: [{ name: "poolId" }],
          },
        ],
      }
    );
  }
  public static associate(models: any) {
    stakingDuration.hasMany(models.stakingLog, {
      as: "stakingLogs",
      foreignKey: "durationId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    stakingDuration.belongsTo(models.stakingPool, {
      as: "pool",
      foreignKey: "poolId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}
