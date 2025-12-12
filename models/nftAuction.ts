// models/nftAuction.ts

import * as Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";
import nftAsset from "./nftAsset";
import nftBid from "./nftBid"; // Import the nftBid type

export default class nftAuction
  extends Model<nftAuctionAttributes, nftAuctionCreationAttributes>
  implements nftAuctionAttributes
{
  id!: string;
  nftAssetId!: string;
  startTime!: Date;
  endTime!: Date;
  startingBid!: number;
  reservePrice?: number;
  currentBidId?: string | null;
  status!: "ACTIVE" | "COMPLETED" | "CANCELLED";

  // Associations
  nftBids?: nftBid[]; // Array of bids for this auction

  // nftAuction belongsTo nftAsset via nftAssetId
  nftAsset!: nftAsset;
  getNftAsset!: Sequelize.BelongsToGetAssociationMixin<nftAsset>;
  setNftAsset!: Sequelize.BelongsToSetAssociationMixin<nftAsset, nftAssetId>;
  createNftAsset!: Sequelize.BelongsToCreateAssociationMixin<nftAsset>;

  // nftAuction belongsTo nftBid via currentBidId
  currentBid?: nftBid;
  getCurrentBid!: Sequelize.BelongsToGetAssociationMixin<nftBid>;
  setCurrentBid!: Sequelize.BelongsToSetAssociationMixin<nftBid, nftBidId>;

  public static initModel(sequelize: Sequelize.Sequelize): typeof nftAuction {
    return nftAuction.init(
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
        },
        startTime: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        endTime: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        startingBid: {
          type: DataTypes.DOUBLE,
          allowNull: false,
        },
        reservePrice: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        currentBidId: {
          type: DataTypes.UUID,
          allowNull: true, // Ensure nullable in Sequelize definition
        },
        status: {
          type: DataTypes.ENUM("ACTIVE", "COMPLETED", "CANCELLED"),
          allowNull: false,
          defaultValue: "ACTIVE",
        },
      },
      {
        sequelize,
        modelName: "nftAuction",
        tableName: "nft_auction",
        timestamps: true,
        paranoid: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            fields: [{ name: "id" }],
          },
        ],
      }
    );
  }
  public static associate(models: any) {
    nftAuction.belongsTo(models.nftAsset, {
      as: "nftAsset",
      foreignKey: "nftAssetId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    nftAuction.hasMany(models.nftBid, {
      as: "nftBids",
      foreignKey: "auctionId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}
