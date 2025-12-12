"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const sequelize_1 = require("sequelize");
class withdrawMethod extends sequelize_1.Model {
    static initModel(sequelize) {
        return withdrawMethod.init({
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
                    notEmpty: { msg: "title: Title cannot be empty" },
                },
            },
            processingTime: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "processingTime: Processing time cannot be empty",
                    },
                },
            },
            instructions: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: { msg: "instructions: Instructions cannot be empty" },
                },
            },
            image: {
                type: sequelize_1.DataTypes.STRING(1000),
                allowNull: true,
            },
            fixedFee: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    isFloat: { msg: "fixedFee: Fixed fee must be a number" },
                },
            },
            percentageFee: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    isFloat: { msg: "percentageFee: Percentage fee must be a number" },
                },
            },
            minAmount: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    isFloat: { msg: "minAmount: Minimum amount must be a number" },
                },
            },
            maxAmount: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isFloat: { msg: "maxAmount: Maximum amount must be a number" },
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
            modelName: "withdrawMethod",
            tableName: "withdraw_method",
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
exports.default = withdrawMethod;
