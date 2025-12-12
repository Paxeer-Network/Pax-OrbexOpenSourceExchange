"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const sequelize_1 = require("sequelize");
class depositMethod extends sequelize_1.Model {
    static initModel(sequelize) {
        return depositMethod.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            title: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "title: Title must not be empty" },
                },
            },
            instructions: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: { msg: "instructions: Instructions must not be empty" },
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
            fixedFee: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    isFloat: { msg: "fixedFee: Fixed fee must be a valid number" },
                    min: { args: [0], msg: "fixedFee: Fixed fee cannot be negative" },
                },
            },
            percentageFee: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
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
                allowNull: false,
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
                allowNull: false,
                validate: {
                    isFloat: {
                        msg: "maxAmount: Maximum amount must be a valid number",
                    },
                },
            },
            customFields: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: true,
                get() {
                    const rawData = this.getDataValue("customFields");
                    return rawData ? JSON.parse(rawData) : null;
                },
                set(fields) {
                    this.setDataValue("customFields", JSON.stringify(fields
                        .filter((field) => field.title && field.title !== "")
                        .map((field) => ({
                        name: (0, lodash_1.camelCase)(field.title.trim()),
                        title: field.title.trim(),
                        type: field.type,
                        required: field.required,
                    }))));
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
            modelName: "depositMethod",
            tableName: "deposit_method",
            timestamps: true,
            paranoid: true,
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
    static associate(models) { }
}
exports.default = depositMethod;
