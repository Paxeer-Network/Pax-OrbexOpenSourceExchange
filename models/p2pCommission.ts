import * as Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";
import p2pTrade from "./p2pTrade";

export default class p2pCommission
  extends Model<p2pCommissionAttributes, p2pCommissionCreationAttributes>
  implements p2pCommissionAttributes
{
  id!: string;
  tradeId!: string;
  amount!: number;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // p2pCommission belongsTo p2pTrade via tradeId
  trade!: p2pTrade;
  getTrade!: Sequelize.BelongsToGetAssociationMixin<p2pTrade>;
  setTrade!: Sequelize.BelongsToSetAssociationMixin<p2pTrade, p2pTradeId>;
  createTrade!: Sequelize.BelongsToCreateAssociationMixin<p2pTrade>;

  public static initModel(sequelize: Sequelize.Sequelize): typeof p2pCommission {
    return p2pCommission.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        tradeId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: { args: 4, msg: "tradeId: Trade ID must be a valid UUID" },
          },
        },
        amount: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isNumeric: { msg: "amount: Amount must be a numeric value" },
          },
        },
      },
      {
        sequelize,
        modelName: "p2pCommission",
        tableName: "p2p_commission",
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
            name: "p2pCommissionTradeIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "tradeId" }],
          },
        ],
      }
    );
  }
  public static associate(models: any) {
    p2pCommission.belongsTo(models.p2pTrade, {
      as: "trade",
      foreignKey: "tradeId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}
