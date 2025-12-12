"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class exchange extends sequelize_1.Model {
    static initModel(sequelize) {
        return exchange.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "name: Name must not be empty" },
                },
            },
            title: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "title: Title must not be empty" },
                },
            },
            status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false,
                validate: {
                    isBoolean: { msg: "status: Status must be a boolean value" },
                },
            },
            username: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: true,
                validate: {
                    notEmpty: { msg: "username: Username must not be empty" },
                },
            },
            licenseStatus: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false,
                validate: {
                    isBoolean: {
                        msg: "licenseStatus: License Status must be a boolean value",
                    },
                },
            },
            version: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: true,
                defaultValue: "0.0.1",
                validate: {
                    notEmpty: { msg: "version: Version must not be empty" },
                },
            },
            productId: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: true,
                unique: "exchangeProductIdKey",
                validate: {
                    notEmpty: { msg: "productId: Product ID must not be empty" },
                },
            },
            type: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: true,
                defaultValue: "spot",
                validate: {
                    notEmpty: { msg: "type: Type must not be empty" },
                },
            },
        }, {
            sequelize,
            modelName: "exchange",
            tableName: "exchange",
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "id" }],
                },
                {
                    name: "exchangeProductIdKey",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "productId" }],
                },
            ],
        });
    }
    static associate(models) { }
}
exports.default = exchange;
