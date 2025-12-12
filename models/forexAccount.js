"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class forexAccount extends sequelize_1.Model {
    static initModel(sequelize) {
        return forexAccount.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            userId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: true,
                validate: {
                    isUUID: { args: 4, msg: "userId: User ID must be a valid UUID" },
                },
            },
            accountId: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: true,
                validate: {
                    notEmpty: { msg: "accountId: Account ID must not be empty" },
                },
            },
            password: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: true,
                validate: {
                    notEmpty: { msg: "password: Password must not be empty" },
                    len: {
                        args: [6, 191],
                        msg: "password: Password must be between 6 and 191 characters long",
                    },
                },
            },
            broker: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: true,
                validate: {
                    notEmpty: { msg: "broker: Broker name must not be empty" },
                },
            },
            mt: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    isInt: { msg: "mt: MT version must be an integer" },
                },
            },
            balance: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
                defaultValue: 0,
                validate: {
                    isFloat: { msg: "balance: Balance must be a number" },
                },
            },
            leverage: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 1,
                validate: {
                    isInt: { msg: "leverage: Leverage must be an integer" },
                },
            },
            type: {
                type: sequelize_1.DataTypes.ENUM("DEMO", "LIVE"),
                allowNull: false,
                defaultValue: "DEMO",
                validate: {
                    isIn: {
                        args: [["DEMO", "LIVE"]],
                        msg: "type: Type must be either 'DEMO' or 'LIVE'",
                    },
                },
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
            modelName: "forexAccount",
            tableName: "forex_account",
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
                    name: "forexAccountUserIdFkey",
                    using: "BTREE",
                    fields: [{ name: "userId" }],
                },
            ],
        });
    }
    static associate(models) {
        forexAccount.hasMany(models.forexAccountSignal, {
            as: "forexAccountSignals",
            foreignKey: "forexAccountId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        forexAccount.belongsToMany(models.forexSignal, {
            as: "accountSignals",
            through: models.forexAccountSignal,
            foreignKey: "forexAccountId",
            otherKey: "forexSignalId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        forexAccount.belongsTo(models.user, {
            as: "user",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = forexAccount;
