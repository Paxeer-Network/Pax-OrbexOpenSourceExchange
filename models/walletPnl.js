"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class walletPnl extends sequelize_1.Model {
    static initModel(sequelize) {
        return walletPnl.init({
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
                    isUUID: {
                        args: 4,
                        msg: "userId: User ID must be a valid UUID",
                    },
                },
            },
            balances: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: true,
                get() {
                    const rawData = this.getDataValue("balances");
                    // DataTypes.JSON already handles parsing, no need for additional JSON.parse
                    return rawData || null;
                },
            },
        }, {
            sequelize,
            modelName: "walletPnl",
            tableName: "wallet_pnl",
            timestamps: true,
        });
    }
    static associate(models) {
        walletPnl.belongsTo(models.user, {
            as: "user",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = walletPnl;
