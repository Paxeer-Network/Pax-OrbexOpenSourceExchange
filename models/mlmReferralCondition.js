"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class mlmReferralCondition extends sequelize_1.Model {
    static initModel(sequelize) {
        return mlmReferralCondition.init({
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
            title: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "title: Title cannot be empty" },
                },
            },
            description: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "description: Description cannot be empty" },
                },
            },
            type: {
                type: sequelize_1.DataTypes.ENUM("DEPOSIT", "TRADE", "INVESTENT", "INVESTMENT", "AI_INVESTMENT", "FOREX_INVESTMENT", "ICO_CONTRIBUTION", "STAKING", "ECOMMERCE_PURCHASE", "P2P_TRADE"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [
                            [
                                "DEPOSIT",
                                "TRADE",
                                "INVESTENT",
                                "INVESTMENT",
                                "AI_INVESTMENT",
                                "FOREX_INVESTMENT",
                                "ICO_CONTRIBUTION",
                                "STAKING",
                                "ECOMMERCE_PURCHASE",
                                "P2P_TRADE",
                            ],
                        ],
                        msg: "type: Type must be one of DEPOSIT, TRADE, INVESTENT, INVESTMENT, AI_INVESTMENT, FOREX_INVESTMENT, ICO_CONTRIBUTION, STAKING, ECOMMERCE_PURCHASE, P2P_TRADE",
                    },
                },
            },
            reward: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isFloat: { msg: "reward: Reward must be a valid number" },
                },
            },
            rewardType: {
                type: sequelize_1.DataTypes.ENUM("PERCENTAGE", "FIXED"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["PERCENTAGE", "FIXED"]],
                        msg: "rewardType: Reward type must be either PERCENTAGE or FIXED",
                    },
                },
            },
            rewardWalletType: {
                type: sequelize_1.DataTypes.ENUM("FIAT", "SPOT", "ECO"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["FIAT", "SPOT", "ECO"]],
                        msg: "rewardWalletType: Wallet type must be one of FIAT, SPOT, ECO",
                    },
                },
            },
            rewardCurrency: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "rewardCurrency: Reward currency cannot be empty",
                    },
                },
            },
            rewardChain: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: true,
            },
            image: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: true,
            },
            status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                validate: {
                    isBoolean: { msg: "status: Status must be a boolean value" },
                },
            },
        }, {
            sequelize,
            modelName: "mlmReferralCondition",
            tableName: "mlm_referral_condition",
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "id" }],
                },
                {
                    name: "mlmReferralConditionNameKey",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "name" }],
                },
            ],
        });
    }
    static associate(models) {
        mlmReferralCondition.hasMany(models.mlmReferralReward, {
            as: "referralRewards", // Rewards tied to a specific condition
            foreignKey: "conditionId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = mlmReferralCondition;
