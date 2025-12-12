"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class adminProfit extends sequelize_1.Model {
    static initModel(sequelize) {
        return adminProfit.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            transactionId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    notNull: { msg: "transactionId: Transaction ID cannot be null" },
                    isUUID: {
                        args: 4,
                        msg: "transactionId: Transaction ID must be a valid UUID",
                    },
                },
            },
            type: {
                type: sequelize_1.DataTypes.ENUM("DEPOSIT", "WITHDRAW", "TRANSFER", "BINARY_ORDER", "EXCHANGE_ORDER", "INVESTMENT", "AI_INVESTMENT", "FOREX_DEPOSIT", "FOREX_WITHDRAW", "FOREX_INVESTMENT", "ICO_CONTRIBUTION", "STAKING", "P2P_TRADE"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [
                            [
                                "DEPOSIT",
                                "WITHDRAW",
                                "TRANSFER",
                                "BINARY_ORDER",
                                "EXCHANGE_ORDER",
                                "INVESTMENT",
                                "AI_INVESTMENT",
                                "FOREX_DEPOSIT",
                                "FOREX_WITHDRAW",
                                "FOREX_INVESTMENT",
                                "ICO_CONTRIBUTION",
                                "STAKING",
                                "P2P_TRADE",
                            ],
                        ],
                        msg: "type: Type must be one of ['DEPOSIT', 'WITHDRAW', 'TRANSFER', 'BINARY_ORDER', 'EXCHANGE_ORDER', 'INVESTMENT', 'AI_INVESTMENT', 'FOREX_DEPOSIT', 'FOREX_WITHDRAW', 'FOREX_INVESTMENT', 'ICO_CONTRIBUTION', 'STAKING', 'P2P_TRADE']",
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
            currency: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "currency: Currency cannot be empty" },
                },
            },
            chain: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: true,
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
        }, {
            sequelize,
            modelName: "adminProfit",
            tableName: "admin_profit",
            timestamps: true,
            paranoid: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "id" }],
                },
                {
                    name: "adminProfitTransactionIdForeign",
                    using: "BTREE",
                    fields: [{ name: "transactionId" }],
                },
            ],
        });
    }
    static associate(models) {
        adminProfit.belongsTo(models.transaction, {
            as: "transaction",
            foreignKey: "transactionId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = adminProfit;
