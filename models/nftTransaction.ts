import * as Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";
import nftAsset from "./nftAsset";
import user from "./user";

export default class nftTransaction
  extends Model<nftTransactionAttributes, nftTransactionCreationAttributes>
  implements nftTransactionAttributes
{
  id!: string;
  nftAssetId!: string;
  sellerId!: string;
  buyerId!: string;
  price!: number;
  transactionHash!: string;
  type!: "PURCHASE" | "SALE";
  status!: "PENDING" | "COMPLETED" | "FAILED";
  createdAt?: Date;
  updatedAt?: Date;

  // nftTransaction belongsTo nftAsset via nftAssetId
  nftAsset!: nftAsset;
  getNftAsset!: Sequelize.BelongsToGetAssociationMixin<nftAsset>;
  setNftAsset!: Sequelize.BelongsToSetAssociationMixin<nftAsset, nftAssetId>;
  createNftAsset!: Sequelize.BelongsToCreateAssociationMixin<nftAsset>;

  // nftTransaction belongsTo user via sellerId
  seller!: user;
  getSeller!: Sequelize.BelongsToGetAssociationMixin<user>;
  setSeller!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createSeller!: Sequelize.BelongsToCreateAssociationMixin<user>;

  // nftTransaction belongsTo user via buyerId
  buyer!: user;
  getBuyer!: Sequelize.BelongsToGetAssociationMixin<user>;
  setBuyer!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createBuyer!: Sequelize.BelongsToCreateAssociationMixin<user>;

  public static initModel(sequelize: Sequelize.Sequelize): typeof nftTransaction {
    return nftTransaction.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        nftAssetId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: { args: 4, msg: "nftAssetId: Must be a valid UUID" },
          },
        },
        sellerId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: { args: 4, msg: "sellerId: Must be a valid UUID" },
          },
        },
        buyerId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: { args: 4, msg: "buyerId: Must be a valid UUID" },
          },
        },
        price: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isFloat: { msg: "price: Must be a valid number" },
            min: { args: [0], msg: "price: Price cannot be negative" },
          },
        },
        transactionHash: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "transactionHash: Must not be empty" },
          },
        },
        type: {
          type: DataTypes.ENUM("PURCHASE", "SALE"),
          allowNull: false,
          validate: {
            isIn: {
              args: [["PURCHASE", "SALE"]],
              msg: "type: Must be 'PURCHASE' or 'SALE'",
            },
          },
        },
        status: {
          type: DataTypes.ENUM("PENDING", "COMPLETED", "FAILED"),
          allowNull: false,
          defaultValue: "PENDING",
          validate: {
            isIn: {
              args: [["PENDING", "COMPLETED", "FAILED"]],
              msg: "status: Must be 'PENDING', 'COMPLETED', or 'FAILED'",
            },
          },
        },
      },
      {
        sequelize,
        modelName: "nftTransaction",
        tableName: "nft_transaction",
        timestamps: true,
        paranoid: false,
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
    nftTransaction.belongsTo(models.user, {
      as: "buyer",
      foreignKey: "buyerId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    nftTransaction.belongsTo(models.user, {
      as: "seller",
      foreignKey: "sellerId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    nftTransaction.belongsTo(models.nftAsset, {
      as: "nftAsset",
      foreignKey: "nftAssetId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}
