import * as Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";
import stakingPool from "./stakingPool";
import user from "./user";

export default class stakingLog
  extends Model<stakingLogAttributes, stakingLogCreationAttributes>
  implements stakingLogAttributes
{
  id!: string;
  userId!: string;
  poolId!: string;
  durationId!: string;
  amount!: number;
  status!: "ACTIVE" | "RELEASED" | "COLLECTED";
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // stakingLog belongsTo stakingPool via poolId
  pool!: stakingPool;
  getPool!: Sequelize.BelongsToGetAssociationMixin<stakingPool>;
  setPool!: Sequelize.BelongsToSetAssociationMixin<stakingPool, stakingPoolId>;
  createPool!: Sequelize.BelongsToCreateAssociationMixin<stakingPool>;
  // stakingLog belongsTo user via userId
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  public static initModel(sequelize: Sequelize.Sequelize): typeof stakingLog {
    return stakingLog.init(
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
        poolId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: { args: 4, msg: "poolId: Pool ID must be a valid UUID" },
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
        status: {
          type: DataTypes.ENUM("ACTIVE", "RELEASED", "COLLECTED"),
          allowNull: false,
          defaultValue: "ACTIVE",
          validate: {
            isIn: {
              args: [["ACTIVE", "RELEASED", "COLLECTED"]],
              msg: "status: Status must be either 'ACTIVE', 'RELEASED', or 'COLLECTED'",
            },
          },
        },
      },
      {
        sequelize,
        modelName: "stakingLog",
        tableName: "staking_log",
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
            name: "stakingLogIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "stakingLogUserIdFkey",
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
          {
            name: "stakingLogPoolIdFkey",
            using: "BTREE",
            fields: [{ name: "poolId" }],
          },
          {
            name: "uniqueActiveStake",
            unique: true,
            using: "BTREE",
            fields: [
              { name: "userId" },
              { name: "poolId" },
              { name: "status" },
            ],
            where: { status: "ACTIVE" },
          },
        ],
      }
    );
  }
  public static associate(models: any) {
    stakingLog.belongsTo(models.stakingPool, {
      as: "pool",
      foreignKey: "poolId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    stakingLog.belongsTo(models.stakingDuration, {
      as: "duration",
      foreignKey: "durationId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    stakingLog.belongsTo(models.user, {
      as: "user",
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}
