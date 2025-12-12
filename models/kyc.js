"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class kyc extends sequelize_1.Model {
    static initModel(sequelize) {
        return kyc.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            userId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                unique: "kycUserIdForeign",
                validate: {
                    notNull: { msg: "userId: User ID cannot be null" },
                    isUUID: { args: 4, msg: "userId: User ID must be a valid UUID" },
                },
            },
            templateId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: "templateId: Template ID must be a valid UUID",
                    },
                },
            },
            data: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: true,
                get() {
                    const rawValue = this.getDataValue("data");
                    return rawValue ? JSON.parse(rawValue) : null;
                },
            },
            status: {
                type: sequelize_1.DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
                allowNull: false,
                defaultValue: "PENDING",
                validate: {
                    isIn: {
                        args: [["PENDING", "APPROVED", "REJECTED"]],
                        msg: "status: Status must be one of PENDING, APPROVED, REJECTED",
                    },
                },
            },
            level: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    isInt: { msg: "level: Level must be an integer" },
                },
            },
            notes: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
        }, {
            sequelize,
            modelName: "kyc",
            tableName: "kyc",
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
                    name: "kycUserIdKey",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "userId" }],
                },
                {
                    name: "kycUserIdForeign",
                    using: "BTREE",
                    fields: [{ name: "userId" }],
                },
                {
                    name: "kycTemplateIdForeign",
                    using: "BTREE",
                    fields: [{ name: "templateId" }],
                },
            ],
        });
    }
    static associate(models) {
        kyc.belongsTo(models.kycTemplate, {
            as: "template",
            foreignKey: "templateId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        kyc.belongsTo(models.user, {
            as: "user",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = kyc;
