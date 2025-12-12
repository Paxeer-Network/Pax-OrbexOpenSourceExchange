import { DataTypes, Model, Sequelize } from "sequelize";

export default class walletPnl
  extends Model<walletPnlAttributes, walletPnlCreationAttributes>
  implements walletPnlAttributes
{
  id!: string;
  userId!: string;
  balances!: {
    FIAT: number;
    SPOT: number;
    ECO: number;
  };
  createdAt?: Date;
  updatedAt?: Date;

  public static initModel(sequelize: Sequelize): typeof walletPnl {
    return walletPnl.init(
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
            isUUID: {
              args: 4,
              msg: "userId: User ID must be a valid UUID",
            },
          },
        },
        balances: {
          type: DataTypes.JSON,
          allowNull: true,
          get() {
            const rawData = this.getDataValue("balances");
            // DataTypes.JSON already handles parsing, no need for additional JSON.parse
            return rawData || null;
          },
        },
      },
      {
        sequelize,
        modelName: "walletPnl",
        tableName: "wallet_pnl",
        timestamps: true,
      }
    );
  }
  public static associate(models: any) {
    walletPnl.belongsTo(models.user, {
      as: "user",
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}
