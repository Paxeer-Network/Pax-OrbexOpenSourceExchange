"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class kycTemplate extends sequelize_1.Model {
    static initModel(sequelize) {
        return kycTemplate.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            title: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                unique: "kycTemplateTitleKey",
                validate: {
                    notEmpty: { msg: "title: Title cannot be empty" },
                },
            },
            options: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: true,
                get() {
                    const rawData = this.getDataValue("options");
                    return rawData ? JSON.parse(rawData) : null;
                },
                set(value) {
                    this.setDataValue("options", JSON.stringify(value));
                },
            },
            customOptions: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: true,
                get() {
                    const rawData = this.getDataValue("customOptions");
                    return rawData ? JSON.parse(rawData) : null;
                },
                set(value) {
                    this.setDataValue("customOptions", JSON.stringify(value));
                },
            },
            status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false,
                validate: {
                    isBoolean: { msg: "status: Status must be true or false" },
                },
            },
        }, {
            sequelize,
            modelName: "kycTemplate",
            tableName: "kyc_template",
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "id" }],
                },
                {
                    name: "kycTemplateTitleKey",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "title" }],
                },
            ],
        });
    }
    static associate(models) {
        kycTemplate.hasMany(models.kyc, {
            as: "kycs",
            foreignKey: "templateId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = kycTemplate;
