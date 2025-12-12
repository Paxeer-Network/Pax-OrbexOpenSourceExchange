"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class faqCategory extends sequelize_1.Model {
    static initModel(sequelize) {
        return faqCategory.init({
            id: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                primaryKey: true,
            },
        }, {
            sequelize,
            modelName: "faqCategory",
            tableName: "faq_category",
            timestamps: false,
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
    static associate(models) {
        faqCategory.hasMany(models.faq, {
            as: "faqs",
            foreignKey: "faqCategoryId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = faqCategory;
