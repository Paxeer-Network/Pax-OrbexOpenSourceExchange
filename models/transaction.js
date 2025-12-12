"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class transaction extends sequelize_1.Model {
    static initModel(sequelize) {
        return transaction.init({
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
            walletId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    notNull: { msg: "walletId: Wallet ID cannot be null" },
                },
            },
            type: {
                type: sequelize_1.DataTypes.ENUM("FAILED", "DEPOSIT", "WITHDRAW", "OUTGOING_TRANSFER", "INCOMING_TRANSFER", "PAYMENT", "REFUND", "BINARY_ORDER", "EXCHANGE_ORDER", "INVESTMENT", "INVESTMENT_ROI", "AI_INVESTMENT", "AI_INVESTMENT_ROI", "INVOICE", "FOREX_DEPOSIT", "FOREX_WITHDRAW", "FOREX_INVESTMENT", "FOREX_INVESTMENT_ROI", "ICO_CONTRIBUTION", "REFERRAL_REWARD", "STAKING", "STAKING_REWARD", "P2P_OFFER_TRANSFER", "P2P_TRADE"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [
                            [
                                "FAILED",
                                "DEPOSIT",
                                "WITHDRAW",
                                "OUTGOING_TRANSFER",
                                "INCOMING_TRANSFER",
                                "PAYMENT",
                                "REFUND",
                                "BINARY_ORDER",
                                "EXCHANGE_ORDER",
                                "INVESTMENT",
                                "INVESTMENT_ROI",
                                "AI_INVESTMENT",
                                "AI_INVESTMENT_ROI",
                                "INVOICE",
                                "FOREX_DEPOSIT",
                                "FOREX_WITHDRAW",
                                "FOREX_INVESTMENT",
                                "FOREX_INVESTMENT_ROI",
                                "ICO_CONTRIBUTION",
                                "REFERRAL_REWARD",
                                "STAKING",
                                "STAKING_REWARD",
                                "P2P_OFFER_TRANSFER",
                                "P2P_TRADE",
                            ],
                        ],
                        msg: "type: Type must be one of ['FAILED', 'DEPOSIT', 'WITHDRAW', 'OUTGOING_TRANSFER', 'INCOMING_TRANSFER', 'PAYMENT', 'REFUND', 'BINARY_ORDER', 'EXCHANGE_ORDER', 'INVESTMENT', 'INVESTMENT_ROI', 'AI_INVESTMENT', 'AI_INVESTMENT_ROI', 'INVOICE', 'FOREX_DEPOSIT', 'FOREX_WITHDRAW', 'FOREX_INVESTMENT', 'FOREX_INVESTMENT_ROI', 'ICO_CONTRIBUTION', 'REFERRAL_REWARD', 'STAKING', 'STAKING_REWARD', 'P2P_OFFER_TRANSFER', 'P2P_TRADE']",
                    },
                },
            },
            status: {
                type: sequelize_1.DataTypes.ENUM("PENDING", "COMPLETED", "FAILED", "CANCELLED", "EXPIRED", "REJECTED", "REFUNDED", "FROZEN", "PROCESSING", "TIMEOUT"),
                allowNull: false,
                defaultValue: "PENDING",
                validate: {
                    isIn: {
                        args: [
                            [
                                "PENDING",
                                "COMPLETED",
                                "FAILED",
                                "CANCELLED",
                                "EXPIRED",
                                "REJECTED",
                                "REFUNDED",
                                "FROZEN",
                                "PROCESSING",
                                "TIMEOUT",
                            ],
                        ],
                        msg: "status: Status must be one of ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'EXPIRED', 'REJECTED', 'REFUNDED','FROZEN', 'PROCESSING', 'TIMEOUT']",
                    },
                },
            },
            amount: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isFloat: { msg: "amount: Amount must be a number" },
                },
            },
            fee: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
                defaultValue: 0,
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            metadata: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            referenceId: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: true,
                unique: "transactionReferenceIdKey",
            },
        }, {
            sequelize,
            modelName: "transaction",
            tableName: "transaction",
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
                    name: "transactionIdKey",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "id" }],
                },
                {
                    name: "transactionReferenceIdKey",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "referenceId" }],
                },
                {
                    name: "transactionWalletIdForeign",
                    using: "BTREE",
                    fields: [{ name: "walletId" }],
                },
                {
                    name: "transactionUserIdFkey",
                    using: "BTREE",
                    fields: [{ name: "userId" }],
                },
            ],
        });
    }
    static associate(models) {
        transaction.hasOne(models.adminProfit, {
            as: "adminProfit",
            foreignKey: "transactionId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        transaction.belongsTo(models.wallet, {
            as: "wallet",
            foreignKey: "walletId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        transaction.belongsTo(models.user, {
            as: "user",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = transaction;
