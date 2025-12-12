"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class stakingPool extends sequelize_1.Model {
    static initModel(sequelize) {
        return stakingPool.init({
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
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: { msg: "description: Description cannot be empty" },
                },
            },
            currency: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "currency: Currency cannot be empty" },
                },
            },
            chain: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: true,
            },
            type: {
                type: sequelize_1.DataTypes.ENUM("FIAT", "SPOT", "ECO"),
                allowNull: false,
                defaultValue: "SPOT",
                validate: {
                    isIn: {
                        args: [["FIAT", "SPOT", "ECO"]],
                        msg: "type: Type must be one of ['FIAT', 'SPOT', 'ECO']",
                    },
                },
            },
            minStake: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isFloat: { msg: "minStake: Minimum Stake must be a number" },
                },
            },
            maxStake: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isFloat: { msg: "maxStake: Maximum Stake must be a number" },
                },
            },
            status: {
                type: sequelize_1.DataTypes.ENUM("ACTIVE", "INACTIVE", "COMPLETED"),
                allowNull: false,
                defaultValue: "ACTIVE",
                validate: {
                    isIn: {
                        args: [["ACTIVE", "INACTIVE", "COMPLETED"]],
                        msg: "status: Status must be one of ['ACTIVE', 'INACTIVE', 'COMPLETED']",
                    },
                },
            },
            icon: {
                type: sequelize_1.DataTypes.STRING(1000),
                allowNull: true,
                validate: {
                    is: {
                        args: ["^/(uploads|img)/.*$", "i"],
                        msg: "icon: icon must be a valid URL",
                    },
                },
            },
        }, {
            sequelize,
            modelName: "stakingPool",
            tableName: "staking_pool",
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
                    name: "stakingPoolIdKey",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "id" }],
                },
            ],
        });
    }
    static associate(models) {
        stakingPool.hasMany(models.stakingLog, {
            as: "stakingLogs",
            foreignKey: "poolId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        stakingPool.hasMany(models.stakingDuration, {
            as: "stakingDurations",
            foreignKey: "poolId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = stakingPool;
