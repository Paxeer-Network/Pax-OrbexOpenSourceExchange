"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class paymentIntentProduct extends sequelize_1.Model {
    static initModel(sequelize) {
        return paymentIntentProduct.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            paymentIntentId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            quantity: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            price: {
                type: sequelize_1.DataTypes.FLOAT,
                allowNull: false,
            },
            currency: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            sku: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            image: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
        }, {
            sequelize,
            modelName: "paymentIntentProduct",
            tableName: "payment_intent_product",
            timestamps: true,
        });
    }
}
exports.default = paymentIntentProduct;
