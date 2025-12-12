"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class supportTicket extends sequelize_1.Model {
    static initModel(sequelize) {
        return supportTicket.init({
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
            agentId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: true,
                validate: {
                    isUUID: { args: 4, msg: "agentId: Agent ID must be a valid UUID" },
                },
            },
            subject: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "subject: Subject cannot be empty" },
                },
            },
            importance: {
                type: sequelize_1.DataTypes.ENUM("LOW", "MEDIUM", "HIGH"),
                allowNull: false,
                defaultValue: "LOW",
                validate: {
                    isIn: {
                        args: [["LOW", "MEDIUM", "HIGH"]],
                        msg: "importance: Importance must be one of ['LOW', 'MEDIUM', 'HIGH']",
                    },
                },
            },
            messages: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: true,
                get() {
                    const value = this.getDataValue("messages");
                    return value ? JSON.parse(value) : null;
                },
            },
            status: {
                type: sequelize_1.DataTypes.ENUM("PENDING", "OPEN", "REPLIED", "CLOSED"),
                allowNull: false,
                defaultValue: "PENDING",
                validate: {
                    isIn: {
                        args: [["PENDING", "OPEN", "REPLIED", "CLOSED"]],
                        msg: "status: Status must be one of ['PENDING', 'OPEN', 'REPLIED', 'CLOSED']",
                    },
                },
            },
            type: {
                type: sequelize_1.DataTypes.ENUM("LIVE", "TICKET"),
                allowNull: false,
                defaultValue: "TICKET",
                validate: {
                    isIn: {
                        args: [["LIVE", "TICKET"]],
                        msg: "type: Type must be one of ['LIVE', 'TICKET']",
                    },
                },
            },
        }, {
            sequelize,
            modelName: "supportTicket",
            tableName: "support_ticket",
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
                    name: "agentId",
                    using: "BTREE",
                    fields: [{ name: "agentId" }],
                },
                {
                    name: "supportTicketUserIdForeign",
                    using: "BTREE",
                    fields: [{ name: "userId" }],
                },
            ],
        });
    }
    static associate(models) {
        supportTicket.belongsTo(models.user, {
            as: "user",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        supportTicket.belongsTo(models.user, {
            as: "agent",
            foreignKey: "agentId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = supportTicket;
