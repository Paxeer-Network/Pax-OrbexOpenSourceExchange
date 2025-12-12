"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class nftTransaction extends sequelize_1.Model {
    static initModel(sequelize) {
        return nftTransaction.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            nftAssetId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: { args: 4, msg: "nftAssetId: Must be a valid UUID" },
                },
            },
            sellerId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: { args: 4, msg: "sellerId: Must be a valid UUID" },
                },
            },
            buyerId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: { args: 4, msg: "buyerId: Must be a valid UUID" },
                },
            },
            price: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isFloat: { msg: "price: Must be a valid number" },
                    min: { args: [0], msg: "price: Price cannot be negative" },
                },
            },
            transactionHash: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "transactionHash: Must not be empty" },
                },
            },
            type: {
                type: sequelize_1.DataTypes.ENUM("PURCHASE", "SALE"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["PURCHASE", "SALE"]],
                        msg: "type: Must be 'PURCHASE' or 'SALE'",
                    },
                },
            },
            status: {
                type: sequelize_1.DataTypes.ENUM("PENDING", "COMPLETED", "FAILED"),
                allowNull: false,
                defaultValue: "PENDING",
                validate: {
                    isIn: {
                        args: [["PENDING", "COMPLETED", "FAILED"]],
                        msg: "status: Must be 'PENDING', 'COMPLETED', or 'FAILED'",
                    },
                },
            },
        }, {
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
        });
    }
    static associate(models) {
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
exports.default = nftTransaction;
