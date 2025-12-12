"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class p2pReview extends sequelize_1.Model {
    static initModel(sequelize) {
        return p2pReview.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            reviewerId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: "reviewerId: Reviewer ID must be a valid UUID",
                    },
                },
            },
            reviewedId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: "reviewedId: Reviewed ID must be a valid UUID",
                    },
                },
            },
            offerId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
            },
            rating: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: { msg: "rating: Rating must be an integer" },
                },
            },
            comment: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: true,
            },
        }, {
            sequelize,
            modelName: "p2pReview",
            tableName: "p2p_review",
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
                    name: "p2pReviewReviewerIdReviewedIdOfferIdKey",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "reviewerId" },
                        { name: "reviewedId" },
                        { name: "offerId" },
                    ],
                },
                {
                    name: "p2pReviewReviewedIdFkey",
                    using: "BTREE",
                    fields: [{ name: "reviewedId" }],
                },
                {
                    name: "p2pReviewOfferIdFkey",
                    using: "BTREE",
                    fields: [{ name: "offerId" }],
                },
            ],
        });
    }
    static associate(models) {
        p2pReview.belongsTo(models.p2pOffer, {
            as: "offer",
            foreignKey: "offerId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        p2pReview.belongsTo(models.user, {
            as: "reviewer",
            foreignKey: "reviewerId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        p2pReview.belongsTo(models.user, {
            as: "reviewed",
            foreignKey: "reviewedId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = p2pReview;
