"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class page extends sequelize_1.Model {
    static initModel(sequelize) {
        return page.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            slug: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
                unique: "pageSlugKey",
                validate: {
                    notEmpty: { msg: "slug: Slug cannot be empty" },
                },
            },
            path: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
                defaultValue: "",
            },
            title: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "title: Title cannot be empty" },
                },
            },
            content: {
                type: sequelize_1.DataTypes.TEXT("long"),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "content: Content cannot be empty" },
                },
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            image: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            order: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
            },
            visits: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            status: {
                type: sequelize_1.DataTypes.ENUM("PUBLISHED", "DRAFT"),
                allowNull: false,
                defaultValue: "DRAFT",
                validate: {
                    isIn: {
                        args: [["PUBLISHED", "DRAFT"]],
                        msg: "status: Status must be either PUBLISHED or DRAFT",
                    },
                },
            },
        }, {
            sequelize,
            modelName: "page",
            tableName: "page",
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
                    name: "pageSlugKey",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "slug" }],
                },
            ],
        });
    }
    static associate(models) { }
}
exports.default = page;
