"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class p2pTrade extends sequelize_1.Model {
    static initModel(sequelize) {
        return p2pTrade.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            userId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    notNull: { msg: "userId: User ID cannot be null" },
                    isUUID: { args: 4, msg: "userId: User ID must be a valid UUID" },
                },
            },
            sellerId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    notNull: { msg: "sellerId: User ID cannot be null" },
                    isUUID: {
                        args: 4,
                        msg: "sellerId: Seller ID must be a valid UUID",
                    },
                },
            },
            offerId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    notNull: { msg: "offerId: Offer ID cannot be null" },
                },
            },
            amount: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isNumeric: { msg: "amount: Amount must be a numeric value" },
                },
            },
            status: {
                type: sequelize_1.DataTypes.ENUM("PENDING", "PAID", "DISPUTE_OPEN", "ESCROW_REVIEW", "CANCELLED", "COMPLETED", "REFUNDED"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [
                            [
                                "PENDING",
                                "PAID",
                                "DISPUTE_OPEN",
                                "ESCROW_REVIEW",
                                "CANCELLED",
                                "COMPLETED",
                                "REFUNDED",
                            ],
                        ],
                        msg: "status: Invalid status value",
                    },
                },
            },
            messages: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: true,
                get() {
                    const value = this.getDataValue("messages");
                    return value ? JSON.parse(value) : null;
                },
            },
            txHash: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: true,
            },
        }, {
            sequelize,
            modelName: "p2pTrade",
            tableName: "p2p_trade",
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
                    name: "p2pTradeIdKey",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "id" }],
                },
                {
                    name: "p2pTradeUserIdFkey",
                    using: "BTREE",
                    fields: [{ name: "userId" }],
                },
                {
                    name: "p2pTradeSellerIdFkey",
                    using: "BTREE",
                    fields: [{ name: "sellerId" }],
                },
                {
                    name: "p2pTradeOfferIdFkey",
                    using: "BTREE",
                    fields: [{ name: "offerId" }],
                },
            ],
        });
    }
    static associate(models) {
        p2pTrade.belongsTo(models.p2pOffer, {
            as: "offer",
            foreignKey: "offerId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        p2pTrade.hasOne(models.p2pCommission, {
            as: "p2pCommission",
            foreignKey: "tradeId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        p2pTrade.hasMany(models.p2pDispute, {
            as: "p2pDisputes",
            foreignKey: "tradeId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        p2pTrade.hasOne(models.p2pEscrow, {
            as: "p2pEscrow",
            foreignKey: "tradeId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        p2pTrade.belongsTo(models.user, {
            as: "user",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        p2pTrade.belongsTo(models.user, {
            as: "seller",
            foreignKey: "sellerId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = p2pTrade;
