"use strict";
// models/nftAuction.ts
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class nftAuction extends sequelize_1.Model {
    static initModel(sequelize) {
        return nftAuction.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            nftAssetId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            startTime: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            endTime: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
            },
            startingBid: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
            },
            reservePrice: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
            },
            currentBidId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: true, // Ensure nullable in Sequelize definition
            },
            status: {
                type: sequelize_1.DataTypes.ENUM("ACTIVE", "COMPLETED", "CANCELLED"),
                allowNull: false,
                defaultValue: "ACTIVE",
            },
        }, {
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
        });
    }
    static associate(models) {
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
exports.default = nftAuction;
