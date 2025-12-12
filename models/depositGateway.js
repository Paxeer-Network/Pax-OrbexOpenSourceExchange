"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class depositGateway extends sequelize_1.Model {
    static initModel(sequelize) {
        return depositGateway.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                unique: "depositGatewayNameKey",
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
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: { msg: "description: Description must not be empty" },
                },
            },
            image: {
                type: sequelize_1.DataTypes.STRING(1000),
                allowNull: true,
                validate: {
                    is: {
                        args: ["^/(uploads|img)/.*$", "i"],
                        msg: "image: Image must be a valid URL",
                    },
                },
            },
            alias: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: true,
                unique: "depositGatewayAliasKey",
            },
            currencies: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: true,
                get() {
                    const rawData = this.getDataValue("currencies");
                    // Parse the JSON string back into an object
                    return rawData ? JSON.parse(rawData) : null;
                },
            },
            fixedFee: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
                defaultValue: 0,
                validate: {
                    isFloat: { msg: "fixedFee: Fixed fee must be a valid number" },
                    min: { args: [0], msg: "fixedFee: Fixed fee cannot be negative" },
                },
            },
            percentageFee: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
                defaultValue: 0,
                validate: {
                    isFloat: {
                        msg: "percentageFee: Percentage fee must be a valid number",
                    },
                    min: {
                        args: [0],
                        msg: "percentageFee: Percentage fee cannot be negative",
                    },
                },
            },
            minAmount: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
                defaultValue: 0,
                validate: {
                    isFloat: {
                        msg: "minAmount: Minimum amount must be a valid number",
                    },
                    min: {
                        args: [0],
                        msg: "minAmount: Minimum amount cannot be negative",
                    },
                },
            },
            maxAmount: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
                validate: {
                    isFloat: {
                        msg: "maxAmount: Maximum amount must be a valid number",
                    },
                },
            },
            type: {
                type: sequelize_1.DataTypes.ENUM("FIAT", "CRYPTO"),
                allowNull: false,
                defaultValue: "FIAT",
                validate: {
                    isIn: {
                        args: [["FIAT", "CRYPTO"]],
                        msg: "type: Must be either 'FIAT' or 'CRYPTO'",
                    },
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
            version: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: true,
                defaultValue: "0.0.1",
            },
            productId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: true,
                unique: "depositGatewayProductIdKey",
                validate: {
                    isUUID: {
                        args: 4,
                        msg: "productId: Product ID must be a valid UUID",
                    },
                },
            },
        }, {
            sequelize,
            modelName: "depositGateway",
            tableName: "deposit_gateway",
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "id" }],
                },
                {
                    name: "depositGatewayNameKey",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "name" }],
                },
                {
                    name: "depositGatewayAliasKey",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "alias" }],
                },
                {
                    name: "depositGatewayProductIdKey",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "productId" }],
                },
            ],
        });
    }
    static associate(models) { }
}
exports.default = depositGateway;
