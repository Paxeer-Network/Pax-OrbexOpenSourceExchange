"use strict";
// models/nftBid.ts
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class nftBid extends sequelize_1.Model {
    static initModel(sequelize) {
        return nftBid.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            auctionId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            bidderId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            amount: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isFloat: { msg: "amount: Must be a valid number" },
                    min: { args: [0], msg: "amount: Amount cannot be negative" },
                },
            },
            status: {
                type: sequelize_1.DataTypes.ENUM("PENDING", "ACCEPTED", "DECLINED"),
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
                type: sequelize_1.DataTypes.UUID,
                allowNull: true,
            },
        }, {
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
        });
    }
    static associate(models) {
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
exports.default = nftBid;
