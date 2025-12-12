"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class p2pEscrow extends sequelize_1.Model {
    static initModel(sequelize) {
        return p2pEscrow.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            tradeId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: { args: 4, msg: "tradeId: Trade ID must be a valid UUID" },
                },
            },
            amount: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isNumeric: { msg: "amount: Amount must be a numeric value" },
                },
            },
            status: {
                type: sequelize_1.DataTypes.ENUM("PENDING", "HELD", "RELEASED", "CANCELLED"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["PENDING", "HELD", "RELEASED", "CANCELLED"]],
                        msg: "status: Status must be one of PENDING, HELD, RELEASED, CANCELLED",
                    },
                },
            },
        }, {
            sequelize,
            modelName: "p2pEscrow",
            tableName: "p2p_escrow",
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
                    name: "p2pEscrowTradeIdKey",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "tradeId" }],
                },
            ],
        });
    }
    static associate(models) {
        p2pEscrow.belongsTo(models.p2pTrade, {
            as: "trade",
            foreignKey: "tradeId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = p2pEscrow;
