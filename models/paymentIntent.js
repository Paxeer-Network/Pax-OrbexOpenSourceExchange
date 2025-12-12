"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class paymentIntent extends sequelize_1.Model {
    static initModel(sequelize) {
        return paymentIntent.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            userId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: true,
            },
            walletId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: true,
            },
            amount: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isFloat: { msg: "amount: Amount must be a number" },
                },
            },
            currency: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            tax: {
                type: sequelize_1.DataTypes.DOUBLE, // Tax field added
                allowNull: false,
                defaultValue: 0,
                validate: {
                    isFloat: { msg: "tax: Tax must be a valid number" },
                },
            },
            discount: {
                type: sequelize_1.DataTypes.DOUBLE, // Discount field added
                allowNull: false,
                defaultValue: 0,
                validate: {
                    isFloat: { msg: "discount: Discount must be a valid number" },
                },
            },
            status: {
                type: sequelize_1.DataTypes.ENUM("PENDING", "COMPLETED", "FAILED", "EXPIRED"),
                allowNull: false,
                defaultValue: "PENDING",
            },
            ipnUrl: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
            },
            apiKey: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
            },
            successUrl: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
            },
            failUrl: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
            },
            transactionId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: true,
                validate: {
                    isUUID: { args: 4, msg: "transactionId: Must be a valid UUID" },
                },
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
        }, {
            sequelize,
            modelName: "paymentIntent",
            tableName: "payment_intent",
            timestamps: true,
        });
    }
    static associate(models) {
        paymentIntent.belongsTo(models.user, {
            as: "user",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        paymentIntent.belongsTo(models.wallet, {
            as: "wallet",
            foreignKey: "walletId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        paymentIntent.hasMany(models.paymentIntentProduct, {
            as: "products",
            foreignKey: "paymentIntentId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = paymentIntent;
