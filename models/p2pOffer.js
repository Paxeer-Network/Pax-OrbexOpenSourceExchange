"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class p2pOffer extends sequelize_1.Model {
    static initModel(sequelize) {
        return p2pOffer.init({
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
            paymentMethodId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            walletType: {
                type: sequelize_1.DataTypes.ENUM("FIAT", "SPOT", "ECO"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["FIAT", "SPOT", "ECO"]],
                        msg: "walletType: Wallet Type must be one of FIAT, SPOT, ECO",
                    },
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
            amount: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isNumeric: { msg: "amount: Amount must be a numeric value" },
                },
            },
            minAmount: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isNumeric: {
                        msg: "minAmount: Minimum Amount must be a numeric value",
                    },
                },
            },
            maxAmount: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
                validate: {
                    isNumeric: {
                        msg: "maxAmount: Maximum Amount must be a numeric value",
                    },
                },
            },
            inOrder: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isNumeric: {
                        msg: "inOrder: In Order amount must be a numeric value",
                    },
                },
            },
            price: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isNumeric: { msg: "price: Price must be a numeric value" },
                },
            },
            status: {
                type: sequelize_1.DataTypes.ENUM("PENDING", "ACTIVE", "COMPLETED", "CANCELLED"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"]],
                        msg: "status: Status must be one of PENDING, ACTIVE, COMPLETED, CANCELLED",
                    },
                },
            },
        }, {
            sequelize,
            modelName: "p2pOffer",
            tableName: "p2p_offer",
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
                    name: "p2pOfferIdKey",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "id" }],
                },
                {
                    name: "p2pOfferUserIdFkey",
                    using: "BTREE",
                    fields: [{ name: "userId" }],
                },
                {
                    name: "p2pOfferPaymentMethodIdFkey",
                    using: "BTREE",
                    fields: [{ name: "paymentMethodId" }],
                },
            ],
        });
    }
    static associate(models) {
        p2pOffer.hasMany(models.p2pReview, {
            as: "p2pReviews",
            foreignKey: "offerId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        p2pOffer.hasMany(models.p2pTrade, {
            as: "p2pTrades",
            foreignKey: "offerId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        p2pOffer.belongsTo(models.p2pPaymentMethod, {
            as: "paymentMethod",
            foreignKey: "paymentMethodId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        p2pOffer.belongsTo(models.user, {
            as: "user",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = p2pOffer;
