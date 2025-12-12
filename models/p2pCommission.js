"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class p2pCommission extends sequelize_1.Model {
    static initModel(sequelize) {
        return p2pCommission.init({
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
        }, {
            sequelize,
            modelName: "p2pCommission",
            tableName: "p2p_commission",
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
                    name: "p2pCommissionTradeIdKey",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "tradeId" }],
                },
            ],
        });
    }
    static associate(models) {
        p2pCommission.belongsTo(models.p2pTrade, {
            as: "trade",
            foreignKey: "tradeId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = p2pCommission;
