"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class icoPhase extends sequelize_1.Model {
    static initModel(sequelize) {
        return icoPhase.init({
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
            startDate: {
                type: sequelize_1.DataTypes.DATE(3),
                allowNull: false,
                validate: {
                    isDate: {
                        msg: "startDate: Start date must be a valid date",
                        args: true,
                    },
                },
            },
            endDate: {
                type: sequelize_1.DataTypes.DATE(3),
                allowNull: false,
                validate: {
                    isDate: {
                        msg: "endDate: End date must be a valid date",
                        args: true,
                    },
                },
            },
            price: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isFloat: { msg: "price: Price must be a valid number" },
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
                        msg: "status: Status must be PENDING, ACTIVE, COMPLETED, REJECTED, or CANCELLED",
                    },
                },
            },
            tokenId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: { args: 4, msg: "tokenId: Token ID must be a valid UUID" },
                },
            },
            minPurchase: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    isFloat: {
                        msg: "minPurchase: Minimum purchase must be a valid number",
                    },
                },
            },
            maxPurchase: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    isFloat: {
                        msg: "maxPurchase: Maximum purchase must be a valid number",
                    },
                },
            },
        }, {
            sequelize,
            modelName: "icoPhase",
            tableName: "ico_phase",
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
                    name: "icoPhaseTokenIdFkey",
                    using: "BTREE",
                    fields: [{ name: "tokenId" }],
                },
            ],
        });
    }
    static associate(models) {
        icoPhase.hasMany(models.icoContribution, {
            as: "icoContributions",
            foreignKey: "phaseId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        icoPhase.hasMany(models.icoPhaseAllocation, {
            as: "icoPhaseAllocations",
            foreignKey: "phaseId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        icoPhase.belongsTo(models.icoToken, {
            as: "token",
            foreignKey: "tokenId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = icoPhase;
