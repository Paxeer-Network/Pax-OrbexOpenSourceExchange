"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class icoContribution extends sequelize_1.Model {
    static initModel(sequelize) {
        return icoContribution.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            userId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    notNull: { msg: "userId: User ID cannot be null" },
                    isUUID: { args: 4, msg: "userId: User ID must be a valid UUID" },
                },
            },
            phaseId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: { args: 4, msg: "phaseId: Phase ID must be a valid UUID" },
                },
            },
            amount: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isFloat: { msg: "amount: Amount must be a valid number" },
                },
            },
            status: {
                type: sequelize_1.DataTypes.ENUM("PENDING", "COMPLETED", "CANCELLED", "REJECTED"),
                allowNull: false,
                defaultValue: "PENDING",
                validate: {
                    isIn: {
                        args: [["PENDING", "COMPLETED", "CANCELLED", "REJECTED"]],
                        msg: "status: Status must be PENDING, COMPLETED, CANCELLED, or REJECTED",
                    },
                },
            },
        }, {
            sequelize,
            modelName: "icoContribution",
            tableName: "ico_contribution",
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
                    name: "icoContributionIdKey",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "id" }],
                },
                {
                    name: "icoContributionUserIdFkey",
                    using: "BTREE",
                    fields: [{ name: "userId" }],
                },
                {
                    name: "icoContributionPhaseIdFkey",
                    using: "BTREE",
                    fields: [{ name: "phaseId" }],
                },
            ],
        });
    }
    static associate(models) {
        icoContribution.belongsTo(models.icoPhase, {
            as: "phase",
            foreignKey: "phaseId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        icoContribution.belongsTo(models.user, {
            as: "user",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = icoContribution;
