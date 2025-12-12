"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class stakingLog extends sequelize_1.Model {
    static initModel(sequelize) {
        return stakingLog.init({
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
            poolId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: { args: 4, msg: "poolId: Pool ID must be a valid UUID" },
                },
            },
            durationId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: "durationId: Duration ID must be a valid UUID",
                    },
                },
            },
            amount: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isFloat: { msg: "amount: Amount must be a number" },
                },
            },
            status: {
                type: sequelize_1.DataTypes.ENUM("ACTIVE", "RELEASED", "COLLECTED"),
                allowNull: false,
                defaultValue: "ACTIVE",
                validate: {
                    isIn: {
                        args: [["ACTIVE", "RELEASED", "COLLECTED"]],
                        msg: "status: Status must be either 'ACTIVE', 'RELEASED', or 'COLLECTED'",
                    },
                },
            },
        }, {
            sequelize,
            modelName: "stakingLog",
            tableName: "staking_log",
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
                    name: "stakingLogIdKey",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "id" }],
                },
                {
                    name: "stakingLogUserIdFkey",
                    using: "BTREE",
                    fields: [{ name: "userId" }],
                },
                {
                    name: "stakingLogPoolIdFkey",
                    using: "BTREE",
                    fields: [{ name: "poolId" }],
                },
                {
                    name: "uniqueActiveStake",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "userId" },
                        { name: "poolId" },
                        { name: "status" },
                    ],
                    where: { status: "ACTIVE" },
                },
            ],
        });
    }
    static associate(models) {
        stakingLog.belongsTo(models.stakingPool, {
            as: "pool",
            foreignKey: "poolId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        stakingLog.belongsTo(models.stakingDuration, {
            as: "duration",
            foreignKey: "durationId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        stakingLog.belongsTo(models.user, {
            as: "user",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = stakingLog;
