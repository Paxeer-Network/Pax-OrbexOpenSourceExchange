"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class invoice extends sequelize_1.Model {
    static initModel(sequelize) {
        return invoice.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            amount: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                validate: {
                    isFloat: { msg: "amount: Amount must be a valid number" },
                },
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
            status: {
                type: sequelize_1.DataTypes.ENUM("UNPAID", "PAID", "CANCELLED"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["UNPAID", "PAID", "CANCELLED"]],
                        msg: "status: Status must be one of UNPAID, PAID, CANCELLED",
                    },
                },
            },
            transactionId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: true,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: "transactionId: Transaction ID must be a valid UUID",
                    },
                },
            },
            senderId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: "senderId: Sender ID must be a valid UUID",
                    },
                },
            },
            receiverId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: "receiverId: Receiver ID must be a valid UUID",
                    },
                },
            },
            dueDate: {
                type: sequelize_1.DataTypes.DATE(3),
                allowNull: true,
                validate: {
                    isDate: {
                        msg: "dueDate: Due date must be a valid date",
                        args: true,
                    },
                },
            },
        }, {
            sequelize,
            modelName: "invoice",
            tableName: "invoice",
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
                    name: "invoiceSenderIdForeign",
                    using: "BTREE",
                    fields: [{ name: "senderId" }],
                },
                {
                    name: "invoiceReceiverIdForeign",
                    using: "BTREE",
                    fields: [{ name: "receiverId" }],
                },
                {
                    name: "invoiceTransactionIdForeign",
                    using: "BTREE",
                    fields: [{ name: "transactionId" }],
                },
            ],
        });
    }
    static associate(models) {
        invoice.belongsTo(models.user, {
            as: "sender",
            foreignKey: "senderId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        invoice.belongsTo(models.user, {
            as: "receiver",
            foreignKey: "receiverId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = invoice;
