"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class faq extends sequelize_1.Model {
    static initModel(sequelize) {
        return faq.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            faqCategoryId: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                validate: {
                    notNull: { msg: "faqCategoryId: FAQ Category ID cannot be null" },
                },
            },
            question: {
                type: sequelize_1.DataTypes.TEXT("long"),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "question: Question must not be empty" },
                },
            },
            answer: {
                type: sequelize_1.DataTypes.TEXT("long"),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "answer: Answer must not be empty" },
                },
            },
            videoUrl: {
                type: sequelize_1.DataTypes.TEXT("long"),
                allowNull: true,
            },
        }, {
            sequelize,
            modelName: "faq",
            tableName: "faq",
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
                    name: "faqCategoryId",
                    using: "BTREE",
                    fields: [{ name: "faqCategoryId" }],
                },
            ],
        });
    }
    static associate(models) {
        faq.belongsTo(models.faqCategory, {
            as: "faqCategory",
            foreignKey: "faqCategoryId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = faq;
