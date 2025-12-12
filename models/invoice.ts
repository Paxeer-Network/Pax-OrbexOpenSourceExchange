import * as Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";
import transaction from "./transaction";
import user from "./user";

export default class invoice
  extends Model<invoiceAttributes, invoiceCreationAttributes>
  implements invoiceAttributes
{
  id!: string;
  amount!: number;
  description?: string;
  status!: "UNPAID" | "PAID" | "CANCELLED";
  transactionId?: number;
  senderId!: string;
  receiverId!: string;
  dueDate?: Date;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // invoice belongsTo transaction via transactionId
  transaction!: transaction;
  getTransaction!: Sequelize.BelongsToGetAssociationMixin<transaction>;
  setTransaction!: Sequelize.BelongsToSetAssociationMixin<
    transaction,
    transactionId
  >;
  createTransaction!: Sequelize.BelongsToCreateAssociationMixin<transaction>;
  // invoice belongsTo user via senderId
  sender!: user;
  getSender!: Sequelize.BelongsToGetAssociationMixin<user>;
  setSender!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createSender!: Sequelize.BelongsToCreateAssociationMixin<user>;
  // invoice belongsTo user via receiverId
  receiver!: user;
  getReceiver!: Sequelize.BelongsToGetAssociationMixin<user>;
  setReceiver!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createReceiver!: Sequelize.BelongsToCreateAssociationMixin<user>;

  public static initModel(sequelize: Sequelize.Sequelize): typeof invoice {
    return invoice.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        amount: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isFloat: { msg: "amount: Amount must be a valid number" },
          },
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM("UNPAID", "PAID", "CANCELLED"),
          allowNull: false,
          validate: {
            isIn: {
              args: [["UNPAID", "PAID", "CANCELLED"]],
              msg: "status: Status must be one of UNPAID, PAID, CANCELLED",
            },
          },
        },
        transactionId: {
          type: DataTypes.UUID,
          allowNull: true,
          validate: {
            isUUID: {
              args: 4,
              msg: "transactionId: Transaction ID must be a valid UUID",
            },
          },
        },
        senderId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: {
              args: 4,
              msg: "senderId: Sender ID must be a valid UUID",
            },
          },
        },
        receiverId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: {
              args: 4,
              msg: "receiverId: Receiver ID must be a valid UUID",
            },
          },
        },
        dueDate: {
          type: DataTypes.DATE(3),
          allowNull: true,
          validate: {
            isDate: {
              msg: "dueDate: Due date must be a valid date",
              args: true,
            },
          },
        },
      },
      {
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
      }
    );
  }
  public static associate(models: any) {
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
