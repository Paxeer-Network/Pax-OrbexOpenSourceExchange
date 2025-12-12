"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class stakingDuration extends sequelize_1.Model {
    static initModel(sequelize) {
        return stakingDuration.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            poolId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: { args: 4, msg: "poolId: Pool ID must be a valid UUID" },
                },
            },
            duration: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: { msg: "duration: Duration must be an integer" },
                },
            },
            interestRate: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isFloat: { msg: "interestRate: Interest Rate must be a number" },
                },
            },
        }, {
            sequelize,
            modelName: "stakingDuration",
            tableName: "staking_duration",
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
                    name: "stakingDurationPoolIdFkey",
                    using: "BTREE",
                    fields: [{ name: "poolId" }],
                },
            ],
        });
    }
    static associate(models) {
        stakingDuration.hasMany(models.stakingLog, {
            as: "stakingLogs",
            foreignKey: "durationId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        stakingDuration.belongsTo(models.stakingPool, {
            as: "pool",
            foreignKey: "poolId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = stakingDuration;
