"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class binaryOrder extends sequelize_1.Model {
    static initModel(sequelize) {
        return binaryOrder.init({
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
            symbol: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "symbol: Symbol must not be empty" },
                },
            },
            price: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isNumeric: { msg: "price: Price must be a number" },
                },
            },
            amount: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isNumeric: { msg: "amount: Amount must be a number" },
                },
            },
            profit: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isNumeric: { msg: "profit: Profit must be a number" },
                },
            },
            side: {
                type: sequelize_1.DataTypes.ENUM("RISE", "FALL", "HIGHER", "LOWER", "TOUCH", "NO_TOUCH", "CALL", "PUT", "UP", "DOWN"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [
                            [
                                "RISE",
                                "FALL",
                                "HIGHER",
                                "LOWER",
                                "TOUCH",
                                "NO_TOUCH",
                                "CALL",
                                "PUT",
                                "UP",
                                "DOWN",
                            ],
                        ],
                        msg: "side: Invalid side for order",
                    },
                },
            },
            type: {
                type: sequelize_1.DataTypes.ENUM("RISE_FALL", "HIGHER_LOWER", "TOUCH_NO_TOUCH", "CALL_PUT", "TURBO"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [
                            [
                                "RISE_FALL",
                                "HIGHER_LOWER",
                                "TOUCH_NO_TOUCH",
                                "CALL_PUT",
                                "TURBO",
                            ],
                        ],
                        msg: "type: Invalid type for order",
                    },
                },
            },
            durationType: {
                type: sequelize_1.DataTypes.ENUM("TIME", "TICKS"),
                allowNull: false,
                defaultValue: "TIME",
                validate: {
                    isIn: {
                        args: [["TIME", "TICKS"]],
                        msg: "durationType: must be 'TIME' or 'TICKS'",
                    },
                },
            },
            barrier: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
                validate: {
                    isNumeric: { msg: "barrier: Barrier must be a number" },
                },
            },
            strikePrice: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
                validate: {
                    isNumeric: { msg: "strikePrice: Strike Price must be a number" },
                },
            },
            payoutPerPoint: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
                validate: {
                    isNumeric: {
                        msg: "payoutPerPoint: Payout Per Point must be a number",
                    },
                },
            },
            status: {
                type: sequelize_1.DataTypes.ENUM("PENDING", "WIN", "LOSS", "DRAW", "CANCELED"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["PENDING", "WIN", "LOSS", "DRAW", "CANCELED"]],
                        msg: "status: must be one of 'PENDING', 'WIN', 'LOSS', 'DRAW','CANCELED'",
                    },
                },
            },
            isDemo: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            closedAt: {
                type: sequelize_1.DataTypes.DATE(3),
                allowNull: false,
                validate: {
                    isDate: {
                        msg: "closedAt: Must be a valid date",
                        args: true,
                    },
                },
            },
            closePrice: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
                validate: {
                    isNumeric: { msg: "closePrice: Close Price must be a number" },
                },
            },
        }, {
            sequelize,
            modelName: "binaryOrder",
            tableName: "binary_order",
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
                    name: "binaryOrderIdKey",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "id" }],
                },
                {
                    name: "binaryOrderUserIdForeign",
                    using: "BTREE",
                    fields: [{ name: "userId" }],
                },
            ],
        });
    }
    static associate(models) {
        binaryOrder.belongsTo(models.user, {
            as: "user",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = binaryOrder;
