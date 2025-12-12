import * as Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";
import p2pTrade from "./p2pTrade";

export default class p2pEscrow
  extends Model<p2pEscrowAttributes, p2pEscrowCreationAttributes>
  implements p2pEscrowAttributes
{
  id!: string;
  tradeId!: string;
  amount!: number;
  status!: "PENDING" | "HELD" | "RELEASED" | "CANCELLED";
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // p2pEscrow belongsTo p2pTrade via tradeId
  trade!: p2pTrade;
  getTrade!: Sequelize.BelongsToGetAssociationMixin<p2pTrade>;
  setTrade!: Sequelize.BelongsToSetAssociationMixin<p2pTrade, p2pTradeId>;
  createTrade!: Sequelize.BelongsToCreateAssociationMixin<p2pTrade>;

  public static initModel(sequelize: Sequelize.Sequelize): typeof p2pEscrow {
    return p2pEscrow.init(
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
        status: {
          type: DataTypes.ENUM("PENDING", "HELD", "RELEASED", "CANCELLED"),
          allowNull: false,
          validate: {
            isIn: {
              args: [["PENDING", "HELD", "RELEASED", "CANCELLED"]],
              msg: "status: Status must be one of PENDING, HELD, RELEASED, CANCELLED",
            },
          },
        },
      },
      {
        sequelize,
        modelName: "p2pEscrow",
        tableName: "p2p_escrow",
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
            name: "p2pEscrowTradeIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "tradeId" }],
          },
        ],
      }
    );
  }
  public static associate(models: any) {
    p2pEscrow.belongsTo(models.p2pTrade, {
      as: "trade",
      foreignKey: "tradeId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}
