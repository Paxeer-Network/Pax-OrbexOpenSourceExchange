"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class icoProject extends sequelize_1.Model {
    static initModel(sequelize) {
        return icoProject.init({
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
                    notEmpty: { msg: "name: Name cannot be empty" },
                },
            },
            description: {
                type: sequelize_1.DataTypes.TEXT("long"),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "description: Description cannot be empty" },
                },
            },
            website: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "website: Website cannot be empty" },
                    isUrl: { msg: "website: Must be a valid URL" },
                },
            },
            whitepaper: {
                type: sequelize_1.DataTypes.TEXT("long"),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "whitepaper: Whitepaper cannot be empty" },
                },
            },
            image: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "image: Image cannot be empty" },
                },
            },
            status: {
                type: sequelize_1.DataTypes.ENUM("PENDING", "ACTIVE", "COMPLETED", "REJECTED", "CANCELLED"),
                allowNull: false,
                defaultValue: "PENDING",
                validate: {
                    isIn: {
                        args: [
                            ["PENDING", "ACTIVE", "COMPLETED", "REJECTED", "CANCELLED"],
                        ],
                        msg: "status: Status must be one of PENDING, ACTIVE, COMPLETED, REJECTED, CANCELLED",
                    },
                },
            },
        }, {
            sequelize,
            modelName: "icoProject",
            tableName: "ico_project",
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
                    name: "icoProjectIdKey",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "id" }],
                },
            ],
        });
    }
    static associate(models) {
        icoProject.hasMany(models.icoToken, {
            as: "icoTokens",
            foreignKey: "projectId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = icoProject;
