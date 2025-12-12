"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class p2pPaymentMethod extends sequelize_1.Model {
    static initModel(sequelize) {
        return p2pPaymentMethod.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            userId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            name: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "name: Name cannot be empty" },
                },
            },
            instructions: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: { msg: "instructions: Instructions cannot be empty" },
                },
            },
            currency: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                defaultValue: "USD",
                validate: {
                    notEmpty: { msg: "currency: Currency cannot be empty" },
                },
            },
            chain: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: true,
            },
            walletType: {
                type: sequelize_1.DataTypes.ENUM("FIAT", "SPOT", "ECO"),
                allowNull: false,
                defaultValue: "FIAT",
                validate: {
                    isIn: {
                        args: [["FIAT", "SPOT", "ECO"]],
                        msg: "walletType: Wallet type must be either FIAT, SPOT, or ECO",
                    },
                },
            },
            image: {
                type: sequelize_1.DataTypes.STRING(1000),
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
            modelName: "p2pPaymentMethod",
            tableName: "p2p_payment_method",
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
                    name: "p2pPaymentMethodUserIdFkey",
                    using: "BTREE",
                    fields: [{ name: "userId" }],
                },
            ],
        });
    }
    static associate(models) {
        p2pPaymentMethod.hasMany(models.p2pOffer, {
            as: "p2pOffers",
            foreignKey: "paymentMethodId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        p2pPaymentMethod.belongsTo(models.user, {
            as: "user",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = p2pPaymentMethod;
