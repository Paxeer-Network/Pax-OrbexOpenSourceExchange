"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class icoPhaseAllocation extends sequelize_1.Model {
    static initModel(sequelize) {
        return icoPhaseAllocation.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            allocationId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: "allocationId: Allocation ID must be a valid UUID",
                    },
                },
            },
            phaseId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: { args: 4, msg: "phaseId: Phase ID must be a valid UUID" },
                },
            },
            percentage: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isFloat: { msg: "percentage: Percentage must be a valid number" },
                },
            },
        }, {
            sequelize,
            modelName: "icoPhaseAllocation",
            tableName: "ico_phase_allocation",
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
                    name: "icoPhaseAllocationAllocationIdFkey",
                    using: "BTREE",
                    fields: [{ name: "allocationId" }],
                },
                {
                    name: "icoPhaseAllocationPhaseIdFkey",
                    using: "BTREE",
                    fields: [{ name: "phaseId" }],
                },
            ],
        });
    }
    static associate(models) {
        icoPhaseAllocation.belongsTo(models.icoAllocation, {
            as: "allocation",
            foreignKey: "allocationId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        icoPhaseAllocation.belongsTo(models.icoPhase, {
            as: "phase",
            foreignKey: "phaseId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = icoPhaseAllocation;
