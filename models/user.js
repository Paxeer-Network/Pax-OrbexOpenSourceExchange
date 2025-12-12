"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class user extends sequelize_1.Model {
    static initModel(sequelize) {
        return user.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            email: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
                unique: "email",
                validate: {
                    isEmail: { msg: "email: Must be a valid email address" },
                },
            },
            password: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
                validate: {
                    len: {
                        args: [8, 255],
                        msg: "password: Password must be between 8 and 255 characters long",
                    },
                },
            },
            avatar: {
                type: sequelize_1.DataTypes.STRING(1000),
                allowNull: true,
                validate: {
                    is: {
                        args: ["^/(uploads|img)/.*$", "i"],
                        msg: "avatar: Must be a valid URL",
                    },
                },
            },
            firstName: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
                validate: {
                    is: {
                        args: [/^[\p{L}]+$/u],
                        msg: "firstName: First name must only contain letters",
                    },
                },
            },
            lastName: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
                validate: {
                    is: {
                        args: [/^[\p{L}]+$/u],
                        msg: "lastName: Last name must only contain letters",
                    },
                },
            },
            emailVerified: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            phone: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
                validate: {
                    is: {
                        args: ["^[+0-9]+$", "i"],
                        msg: "phone: Phone number must contain only digits and can start with a plus sign",
                    },
                },
            },
            roleId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            profile: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: true,
                get() {
                    const rawData = this.getDataValue("profile");
                    // DataTypes.JSON already handles parsing, no need for additional JSON.parse
                    return rawData || null;
                },
                set(value) {
                    // DataTypes.JSON already handles stringification, just set the value
                    this.setDataValue("profile", value);
                },
            },
            lastLogin: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            lastFailedLogin: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: true,
            },
            failedLoginAttempts: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            status: {
                type: sequelize_1.DataTypes.ENUM("ACTIVE", "INACTIVE", "SUSPENDED", "BANNED"),
                allowNull: true,
                defaultValue: "ACTIVE",
            },
        }, {
            sequelize,
            modelName: "user",
            tableName: "user",
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
                    name: "id",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "id" }],
                },
                {
                    name: "email",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "email" }],
                },
                {
                    name: "UserRoleIdFkey",
                    using: "BTREE",
                    fields: [{ name: "roleId" }],
                },
            ],
            hooks: {
                beforeCreate: async (user) => {
                    if (!user.id) {
                        const { v4: uuidv4 } = await Promise.resolve().then(() => __importStar(require('uuid')));
                        user.id = uuidv4();
                    }
                },
            },
        });
    }
    static associate(models) {
        user.hasMany(models.aiInvestment, {
            as: "aiInvestments",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasOne(models.author, {
            as: "author",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.binaryOrder, {
            as: "binaryOrder",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.comment, {
            as: "comments",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.ecommerceOrder, {
            as: "ecommerceOrders",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.ecommerceReview, {
            as: "ecommerceReviews",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasOne(models.ecommerceShippingAddress, {
            as: "ecommerceShippingAddress",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.ecommerceUserDiscount, {
            as: "ecommerceUserDiscounts",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.ecommerceWishlist, {
            as: "ecommerceWishlists",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.exchangeOrder, {
            as: "exchangeOrder",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.exchangeWatchlist, {
            as: "exchangeWatchlists",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.forexAccount, {
            as: "forexAccounts",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.forexInvestment, {
            as: "forexInvestments",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.icoContribution, {
            as: "icoContributions",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.investment, {
            as: "investments",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.invoice, {
            as: "invoices",
            foreignKey: "senderId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.invoice, {
            as: "receiverInvoices",
            foreignKey: "receiverId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasOne(models.kyc, {
            as: "kyc",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.mlmReferral, {
            as: "referredReferrals",
            foreignKey: "referredId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.mlmReferral, {
            as: "referrerReferrals",
            foreignKey: "referrerId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.mlmReferralReward, {
            as: "referralRewards",
            foreignKey: "referrerId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.nftAsset, {
            as: "ownedNfts",
            foreignKey: "ownerId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.nftBid, {
            as: "nftBids",
            foreignKey: "bidderId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.nftCollection, {
            as: "createdCollections",
            foreignKey: "creatorId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.nftComment, {
            as: "nftComments",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.nftFollow, {
            as: "nftFollows",
            foreignKey: "followerId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.nftLike, {
            as: "nftLikes",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.nftTransaction, {
            as: "soldNfts",
            foreignKey: "sellerId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.notification, {
            as: "notifications",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.p2pDispute, {
            as: "p2pDisputes",
            foreignKey: "raisedById",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.p2pOffer, {
            as: "p2pOffers",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.p2pPaymentMethod, {
            as: "p2pPaymentMethods",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.p2pReview, {
            as: "p2pReviews",
            foreignKey: "reviewerId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.p2pReview, {
            as: "reviewedP2pReviews",
            foreignKey: "reviewedId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.p2pTrade, {
            as: "p2pTrades",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.p2pTrade, {
            as: "sellerP2pTrades",
            foreignKey: "sellerId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.providerUser, {
            as: "providerUsers",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.paymentIntent, {
            as: "paymentIntents",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.belongsTo(models.role, {
            as: "role",
            foreignKey: "roleId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.stakingLog, {
            as: "stakingLogs",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.supportTicket, {
            as: "supportTickets",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.supportTicket, {
            as: "agentSupportTickets",
            foreignKey: "agentId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.transaction, {
            as: "transactions",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasOne(models.twoFactor, {
            as: "twoFactor",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.wallet, {
            as: "wallets",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        user.hasMany(models.walletPnl, {
            as: "walletPnls",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = user;
