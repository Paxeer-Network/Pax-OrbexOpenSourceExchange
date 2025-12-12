import * as Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";
import p2pPaymentMethod from "./p2pPaymentMethod";
import p2pReview from "./p2pReview";
import p2pTrade from "./p2pTrade";
import user from "./user";

export default class p2pOffer
  extends Model<p2pOfferAttributes, p2pOfferCreationAttributes>
  implements p2pOfferAttributes
{
  id!: string;
  userId!: string;
  walletType!: "FIAT" | "SPOT" | "ECO";
  currency!: string;
  chain?: string;
  amount!: number;
  minAmount!: number;
  maxAmount?: number;
  inOrder!: number;
  price!: number;
  paymentMethodId!: string;
  status!: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // p2pOffer hasMany p2pReview via offerId
  p2pReviews!: p2pReview[];
  getP2pReviews!: Sequelize.HasManyGetAssociationsMixin<p2pReview>;
  setP2pReviews!: Sequelize.HasManySetAssociationsMixin<p2pReview, p2pReviewId>;
  addP2pReview!: Sequelize.HasManyAddAssociationMixin<p2pReview, p2pReviewId>;
  addP2pReviews!: Sequelize.HasManyAddAssociationsMixin<p2pReview, p2pReviewId>;
  createP2pReview!: Sequelize.HasManyCreateAssociationMixin<p2pReview>;
  removeP2pReview!: Sequelize.HasManyRemoveAssociationMixin<
    p2pReview,
    p2pReviewId
  >;
  removeP2pReviews!: Sequelize.HasManyRemoveAssociationsMixin<
    p2pReview,
    p2pReviewId
  >;
  hasP2pReview!: Sequelize.HasManyHasAssociationMixin<p2pReview, p2pReviewId>;
  hasP2pReviews!: Sequelize.HasManyHasAssociationsMixin<p2pReview, p2pReviewId>;
  countP2pReviews!: Sequelize.HasManyCountAssociationsMixin;
  // p2pOffer hasMany p2pTrade via offerId
  p2pTrades!: p2pTrade[];
  getP2pTrades!: Sequelize.HasManyGetAssociationsMixin<p2pTrade>;
  setP2pTrades!: Sequelize.HasManySetAssociationsMixin<p2pTrade, p2pTradeId>;
  addP2pTrade!: Sequelize.HasManyAddAssociationMixin<p2pTrade, p2pTradeId>;
  addP2pTrades!: Sequelize.HasManyAddAssociationsMixin<p2pTrade, p2pTradeId>;
  createP2pTrade!: Sequelize.HasManyCreateAssociationMixin<p2pTrade>;
  removeP2pTrade!: Sequelize.HasManyRemoveAssociationMixin<
    p2pTrade,
    p2pTradeId
  >;
  removeP2pTrades!: Sequelize.HasManyRemoveAssociationsMixin<
    p2pTrade,
    p2pTradeId
  >;
  hasP2pTrade!: Sequelize.HasManyHasAssociationMixin<p2pTrade, p2pTradeId>;
  hasP2pTrades!: Sequelize.HasManyHasAssociationsMixin<p2pTrade, p2pTradeId>;
  countP2pTrades!: Sequelize.HasManyCountAssociationsMixin;
  // p2pOffer belongsTo p2pPaymentMethod via paymentMethodId
  paymentMethod!: p2pPaymentMethod;
  getPaymentMethod!: Sequelize.BelongsToGetAssociationMixin<p2pPaymentMethod>;
  setPaymentMethod!: Sequelize.BelongsToSetAssociationMixin<
    p2pPaymentMethod,
    p2pPaymentMethodId
  >;
  createPaymentMethod!: Sequelize.BelongsToCreateAssociationMixin<p2pPaymentMethod>;
  // p2pOffer belongsTo user via userId
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  public static initModel(sequelize: Sequelize.Sequelize): typeof p2pOffer {
    return p2pOffer.init(
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
        paymentMethodId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        walletType: {
          type: DataTypes.ENUM("FIAT", "SPOT", "ECO"),
          allowNull: false,
          validate: {
            isIn: {
              args: [["FIAT", "SPOT", "ECO"]],
              msg: "walletType: Wallet Type must be one of FIAT, SPOT, ECO",
            },
          },
        },
        currency: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "currency: Currency cannot be empty" },
          },
        },
        chain: {
          type: DataTypes.STRING(191),
          allowNull: true,
        },
        amount: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isNumeric: { msg: "amount: Amount must be a numeric value" },
          },
        },
        minAmount: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isNumeric: {
              msg: "minAmount: Minimum Amount must be a numeric value",
            },
          },
        },
        maxAmount: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          validate: {
            isNumeric: {
              msg: "maxAmount: Maximum Amount must be a numeric value",
            },
          },
        },
        inOrder: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isNumeric: {
              msg: "inOrder: In Order amount must be a numeric value",
            },
          },
        },
        price: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isNumeric: { msg: "price: Price must be a numeric value" },
          },
        },
        status: {
          type: DataTypes.ENUM("PENDING", "ACTIVE", "COMPLETED", "CANCELLED"),
          allowNull: false,
          validate: {
            isIn: {
              args: [["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"]],
              msg: "status: Status must be one of PENDING, ACTIVE, COMPLETED, CANCELLED",
            },
          },
        },
      },
      {
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
      }
    );
  }
  public static associate(models: any) {
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
