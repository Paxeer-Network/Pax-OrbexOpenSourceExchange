"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class exchangeCurrency extends sequelize_1.Model {
    static initModel(sequelize) {
        return exchangeCurrency.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            currency: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                unique: "exchangeCurrencyCurrencyKey",
                validate: {
                    notEmpty: { msg: "currency: Currency must not be empty" },
                },
            },
            name: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "name: Name must not be empty" },
                },
            },
            precision: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isNumeric: { msg: "precision: Precision must be a number" },
                },
            },
            price: {
                type: sequelize_1.DataTypes.DECIMAL(30, 15), // Updated data type for high precision
                allowNull: true,
                validate: {
                    isDecimal: { msg: "price: Price must be a decimal number" }, // Updated validation
                },
            },
            fee: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
                defaultValue: 0,
                validate: {
                    isNumeric: { msg: "fee: Fee must be a number" },
                },
            },
            status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                validate: {
                    isBoolean: { msg: "status: Status must be a boolean value" },
                },
            },
        }, {
            sequelize,
            modelName: "exchangeCurrency",
            tableName: "exchange_currency",
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "id" }],
                },
                {
                    name: "exchangeCurrencyCurrencyKey",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "currency" }],
                },
            ],
        });
    }
    static associate(models) { }
}
exports.default = exchangeCurrency;
