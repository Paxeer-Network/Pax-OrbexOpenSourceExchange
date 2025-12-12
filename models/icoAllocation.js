"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class icoAllocation extends sequelize_1.Model {
    static initModel(sequelize) {
        return icoAllocation.init({
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
            percentage: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isFloat: { msg: "percentage: Percentage must be a valid number" },
                },
            },
            tokenId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                unique: "icoAllocationTokenIdFkey",
                validate: {
                    isUUID: { args: 4, msg: "tokenId: Token ID must be a valid UUID" },
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
            modelName: "icoAllocation",
            tableName: "ico_allocation",
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
                    name: "icoAllocationTokenIdKey",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "tokenId" }],
                },
            ],
        });
    }
    static associate(models) {
        icoAllocation.hasMany(models.icoPhaseAllocation, {
            as: "icoPhaseAllocations",
            foreignKey: "allocationId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        icoAllocation.belongsTo(models.icoToken, {
            as: "token",
            foreignKey: "tokenId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = icoAllocation;
