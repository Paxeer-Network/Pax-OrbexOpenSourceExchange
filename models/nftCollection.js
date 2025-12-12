"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class nftCollection extends sequelize_1.Model {
    static initModel(sequelize) {
        return nftCollection.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            creatorId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: { args: 4, msg: "creatorId: Must be a valid UUID" },
                },
            },
            name: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "name: Name must not be empty" },
                },
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: { msg: "description: Description must not be empty" },
                },
            },
            chain: {
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: false,
                defaultValue: "ETH",
                validate: {
                    notEmpty: { msg: "chain: Chain must not be empty" },
                },
            },
            image: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: { msg: "image: Image must not be empty" },
                },
            },
            views: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    isInt: true,
                    min: 0,
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
            links: {
                type: sequelize_1.DataTypes.TEXT("long"),
                allowNull: true,
            },
        }, {
            sequelize,
            modelName: "nftCollection",
            tableName: "nft_collection",
            timestamps: true,
            paranoid: true,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    fields: [{ name: "id" }],
                },
            ],
        });
    }
    static associate(models) {
        nftCollection.hasMany(models.nftAsset, {
            as: "nftAssets",
            foreignKey: "collectionId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        nftCollection.belongsTo(models.user, {
            as: "creator",
            foreignKey: "creatorId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        nftCollection.hasMany(models.nftComment, {
            as: "nftComments",
            foreignKey: "collectionId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        nftCollection.hasMany(models.nftFollow, {
            as: "nftFollows",
            foreignKey: "collectionId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = nftCollection;
