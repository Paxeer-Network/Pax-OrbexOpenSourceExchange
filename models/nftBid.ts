// models/nftBid.ts

import * as Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";
import nftAuction from "./nftAuction";
import nftAsset from "./nftAsset"; // Import nftAsset types
import user from "./user";

export default class nftBid
  extends Model<nftBidAttributes, nftBidCreationAttributes>
  implements nftBidAttributes
{
  id!: string;
  auctionId!: string;
  bidderId!: string;
  amount!: number;
  status!: "PENDING" | "ACCEPTED" | "DECLINED";
  nftAssetId?: string;
  createdAt?: Date;
  updatedAt?: Date;

  // Associations
  bidder!: user;
  getBidder!: Sequelize.BelongsToGetAssociationMixin<user>;
  setBidder!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createBidder!: Sequelize.BelongsToCreateAssociationMixin<user>;

  nftAuction!: nftAuction;
  getNftAuction!: Sequelize.BelongsToGetAssociationMixin<nftAuction>;
  setNftAuction!: Sequelize.BelongsToSetAssociationMixin<
    nftAuction,
    nftAuctionId
  >;
  createNftAuction!: Sequelize.BelongsToCreateAssociationMixin<nftAuction>;

  nftAsset!: nftAsset;
  getNftAsset!: Sequelize.BelongsToGetAssociationMixin<nftAsset>;
  setNftAsset!: Sequelize.BelongsToSetAssociationMixin<nftAsset, nftAssetId>;
  createNftAsset!: Sequelize.BelongsToCreateAssociationMixin<nftAsset>;

  public static initModel(sequelize: Sequelize.Sequelize): typeof nftBid {
    return nftBid.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        auctionId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        bidderId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        amount: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isFloat: { msg: "amount: Must be a valid number" },
            min: { args: [0], msg: "amount: Amount cannot be negative" },
          },
        },
        status: {
          type: DataTypes.ENUM("PENDING", "ACCEPTED", "DECLINED"),
          allowNull: false,
          defaultValue: "PENDING",
          validate: {
            isIn: {
              args: [["PENDING", "ACCEPTED", "DECLINED"]],
              msg: "status: Must be 'PENDING', 'ACCEPTED', or 'DECLINED'",
            },
          },
        },
        nftAssetId: {
          type: DataTypes.UUID,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "nftBid",
        tableName: "nft_bid",
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
    nftBid.belongsTo(models.nftAsset, {
      as: "nftAsset",
      foreignKey: "nftAssetId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    nftBid.belongsTo(models.nftAuction, {
      as: "nftAuction",
      foreignKey: "auctionId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    nftBid.belongsTo(models.user, {
      as: "bidder",
      foreignKey: "bidderId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}
