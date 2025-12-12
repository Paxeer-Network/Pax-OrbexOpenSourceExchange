"use strict";
// models/nftAsset.ts
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class nftAsset extends sequelize_1.Model {
    static initModel(sequelize) {
        return nftAsset.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            collectionId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: { args: 4, msg: "collectionId: Must be a valid UUID" },
                },
            },
            ownerId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: { args: 4, msg: "ownerId: Must be a valid UUID" },
                },
            },
            address: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
            },
            index: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: true,
            },
            name: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "name: Name must not be empty" },
                },
            },
            image: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "image: Image URL must not be empty" },
                },
            },
            attributes: {
                type: sequelize_1.DataTypes.TEXT("long"),
                allowNull: true,
            },
            likes: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    isInt: true,
                    min: 0,
                },
            },
            price: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: true,
                validate: {
                    isFloat: { msg: "price: Must be a valid number" },
                    min: { args: [0], msg: "price: Price cannot be negative" },
                },
            },
            royalty: {
                type: sequelize_1.DataTypes.FLOAT,
                allowNull: true,
                validate: {
                    isFloat: { msg: "royalty: Must be a valid percentage" },
                    min: { args: [0], msg: "royalty: Cannot be negative" },
                    max: { args: [100], msg: "royalty: Cannot exceed 100%" },
                },
            },
            featured: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false,
                validate: {
                    isIn: {
                        args: [[true, false]],
                        msg: "featured: Featured must be true or false",
                    },
                },
            },
            status: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
                validate: {
                    isIn: {
                        args: [[true, false]],
                        msg: "status: Status must be true or false",
                    },
                },
            },
        }, {
            sequelize,
            modelName: "nftAsset",
            tableName: "nft_asset",
            timestamps: true,
            paranoid: true,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    fields: [{ name: "id" }],
                },
                {
                    name: "nftAssetNameIndex",
                    fields: [{ name: "name" }],
                },
                {
                    name: "nftAssetOwnerIdIndex",
                    fields: [{ name: "ownerId" }],
                },
                {
                    name: "nftAssetCollectionIdIndex",
                    fields: [{ name: "collectionId" }],
                },
            ],
        });
    }
    static associate(models) {
        nftAsset.belongsTo(models.nftCollection, {
            as: "collection",
            foreignKey: "collectionId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        // nftAsset has one nftAuction via nftAssetId
        nftAsset.hasOne(models.nftAuction, {
            as: "nftAuction",
            foreignKey: "nftAssetId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        nftAsset.hasMany(models.nftBid, {
            as: "nftBids",
            foreignKey: "nftAssetId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        nftAsset.belongsTo(models.user, {
            as: "owner",
            foreignKey: "ownerId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        nftAsset.hasMany(models.nftTransaction, {
            as: "nftTransactions",
            foreignKey: "nftAssetId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = nftAsset;
