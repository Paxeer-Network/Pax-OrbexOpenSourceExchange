"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class exchangeOrder extends sequelize_1.Model {
    static initModel(sequelize) {
        return exchangeOrder.init({
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
            referenceId: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: true,
                unique: "exchangeOrderReferenceIdKey",
            },
            status: {
                type: sequelize_1.DataTypes.ENUM("OPEN", "CLOSED", "CANCELED", "EXPIRED", "REJECTED"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["OPEN", "CLOSED", "CANCELED", "EXPIRED", "REJECTED"]],
                        msg: "status: Must be one of OPEN, CLOSED, CANCELED, EXPIRED, REJECTED",
                    },
                },
            },
            symbol: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "symbol: Symbol must not be empty" },
                },
            },
            type: {
                type: sequelize_1.DataTypes.ENUM("MARKET", "LIMIT"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["MARKET", "LIMIT"]],
                        msg: "type: Must be either MARKET or LIMIT",
                    },
                },
            },
            timeInForce: {
                type: sequelize_1.DataTypes.ENUM("GTC", "IOC", "FOK", "PO"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["GTC", "IOC", "FOK", "PO"]],
                        msg: "timeInForce: Must be one of GTC, IOC, FOK, PO",
                    },
                },
            },
            side: {
                type: sequelize_1.DataTypes.ENUM("BUY", "SELL"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["BUY", "SELL"]],
                        msg: "side: Must be either BUY or SELL",
                    },
                },
            },
            price: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isNumeric: { msg: "price: Must be a numeric value" },
                },
            },
            average: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
            },
            amount: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isNumeric: { msg: "amount: Must be a numeric value" },
                },
            },
            filled: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isNumeric: { msg: "filled: Must be a numeric value" },
                },
            },
            remaining: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isNumeric: { msg: "remaining: Must be a numeric value" },
                },
            },
            cost: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isNumeric: { msg: "cost: Must be a numeric value" },
                },
            },
            trades: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: true,
                get() {
                    const value = this.getDataValue("trades");
                    return value ? JSON.parse(value) : null;
                },
            },
            fee: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isNumeric: { msg: "fee: Must be a numeric value" },
                },
            },
            feeCurrency: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "feeCurrency: Fee currency must not be empty" },
                },
            },
        }, {
            sequelize,
            modelName: "exchangeOrder",
            tableName: "exchange_order",
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
                    name: "exchangeOrderIdKey",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "id" }],
                },
                {
                    name: "exchangeOrderReferenceIdKey",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "referenceId" }],
                },
                {
                    name: "exchangeOrderUserIdForeign",
                    using: "BTREE",
                    fields: [{ name: "userId" }],
                },
            ],
        });
    }
    static associate(models) {
        exchangeOrder.belongsTo(models.user, {
            as: "user",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = exchangeOrder;
