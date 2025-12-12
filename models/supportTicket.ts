import * as Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";

export default class supportTicket
  extends Model<supportTicketAttributes, supportTicketCreationAttributes>
  implements supportTicketAttributes
{
  id!: string;
  userId!: string;
  agentId?: string;
  subject!: string;
  importance!: "LOW" | "MEDIUM" | "HIGH";
  status!: "PENDING" | "OPEN" | "REPLIED" | "CLOSED";
  messages?: ChatMessage[];
  type?: "LIVE" | "TICKET";
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  public static initModel(
    sequelize: Sequelize.Sequelize
  ): typeof supportTicket {
    return supportTicket.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,

          validate: {
            notNull: { msg: "userId: User ID cannot be null" },
            isUUID: { args: 4, msg: "userId: User ID must be a valid UUID" },
          },
        },
        agentId: {
          type: DataTypes.UUID,
          allowNull: true,
          validate: {
            isUUID: { args: 4, msg: "agentId: Agent ID must be a valid UUID" },
          },
        },
        subject: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "subject: Subject cannot be empty" },
          },
        },
        importance: {
          type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH"),
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
          type: DataTypes.JSON,
          allowNull: true,
          get() {
            const value = this.getDataValue("messages");
            return value ? JSON.parse(value as any) : null;
          },
        },
        status: {
          type: DataTypes.ENUM("PENDING", "OPEN", "REPLIED", "CLOSED"),
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
          type: DataTypes.ENUM("LIVE", "TICKET"),
          allowNull: false,
          defaultValue: "TICKET",
          validate: {
            isIn: {
              args: [["LIVE", "TICKET"]],
              msg: "type: Type must be one of ['LIVE', 'TICKET']",
            },
          },
        },
      },
      {
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
      }
    );
  }
  public static associate(models: any) {
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
