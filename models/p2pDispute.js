"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class p2pDispute extends sequelize_1.Model {
    static initModel(sequelize) {
        return p2pDispute.init({
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
            raisedById: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: "raisedById: Raised By ID must be a valid UUID",
                    },
                },
            },
            reason: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: { msg: "reason: Reason cannot be empty" },
                },
            },
            status: {
                type: sequelize_1.DataTypes.ENUM("PENDING", "OPEN", "RESOLVED", "CANCELLED"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["PENDING", "OPEN", "RESOLVED", "CANCELLED"]],
                        msg: "status: Status must be one of PENDING, OPEN, RESOLVED, CANCELLED",
                    },
                },
            },
            resolution: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
        }, {
            sequelize,
            modelName: "p2pDispute",
            tableName: "p2p_dispute",
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
                    name: "p2pDisputeTradeIdFkey",
                    using: "BTREE",
                    fields: [{ name: "tradeId" }],
                },
                {
                    name: "p2pDisputeRaisedByIdFkey",
                    using: "BTREE",
                    fields: [{ name: "raisedById" }],
                },
            ],
        });
    }
    static associate(models) {
        p2pDispute.belongsTo(models.user, {
            as: "raisedBy",
            foreignKey: "raisedById",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        p2pDispute.belongsTo(models.p2pTrade, {
            as: "trade",
            foreignKey: "tradeId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = p2pDispute;
