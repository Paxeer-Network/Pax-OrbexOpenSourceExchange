// models/nftAsset.ts

import * as Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";
import nftBid from "./nftBid";
import nftTransaction from "./nftTransaction";
import nftCollection from "./nftCollection";
import nftAuction from "./nftAuction";
import nftLike from "./nftLike";
import user from "./user";

export default class nftAsset
  extends Model<nftAssetAttributes, nftAssetCreationAttributes>
  implements nftAssetAttributes
{
  id!: string;
  collectionId!: string;
  ownerId!: string;
  address?: string;
  index?: number;
  name!: string;
  image!: string;
  attributes?: string;
  likes!: number;
  price?: number;
  royalty?: number;
  featured?: boolean;
  status!: boolean;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // nftAsset belongsTo nftCollection via collectionId
  collection!: nftCollection;
  getCollection!: Sequelize.BelongsToGetAssociationMixin<nftCollection>;
  setCollection!: Sequelize.BelongsToSetAssociationMixin<
    nftCollection,
    nftCollectionId
  >;
  createCollection!: Sequelize.BelongsToCreateAssociationMixin<nftCollection>;

  // nftAsset belongsTo user via ownerId
  owner!: user;
  getOwner!: Sequelize.BelongsToGetAssociationMixin<user>;
  setOwner!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createOwner!: Sequelize.BelongsToCreateAssociationMixin<user>;

  // nftAsset hasMany nftBid via nftAssetId
  nftBids!: nftBid[];
  getNftBids!: Sequelize.HasManyGetAssociationsMixin<nftBid>;
  setNftBids!: Sequelize.HasManySetAssociationsMixin<nftBid, nftBidId>;
  addNftBid!: Sequelize.HasManyAddAssociationMixin<nftBid, nftBidId>;
  addNftBids!: Sequelize.HasManyAddAssociationsMixin<nftBid, nftBidId>;
  createNftBid!: Sequelize.HasManyCreateAssociationMixin<nftBid>;
  removeNftBid!: Sequelize.HasManyRemoveAssociationMixin<nftBid, nftBidId>;
  removeNftBids!: Sequelize.HasManyRemoveAssociationsMixin<nftBid, nftBidId>;
  hasNftBid!: Sequelize.HasManyHasAssociationMixin<nftBid, nftBidId>;
  hasNftBids!: Sequelize.HasManyHasAssociationsMixin<nftBid, nftBidId>;
  countNftBids!: Sequelize.HasManyCountAssociationsMixin;

  // nftAsset hasMany nftTransaction via nftAssetId
  nftTransactions!: nftTransaction[];
  getNftTransactions!: Sequelize.HasManyGetAssociationsMixin<nftTransaction>;
  setNftTransactions!: Sequelize.HasManySetAssociationsMixin<
    nftTransaction,
    nftTransactionId
  >;
  addNftTransaction!: Sequelize.HasManyAddAssociationMixin<
    nftTransaction,
    nftTransactionId
  >;
  addNftTransactions!: Sequelize.HasManyAddAssociationsMixin<
    nftTransaction,
    nftTransactionId
  >;
  createNftTransaction!: Sequelize.HasManyCreateAssociationMixin<nftTransaction>;
  removeNftTransaction!: Sequelize.HasManyRemoveAssociationMixin<
    nftTransaction,
    nftTransactionId
  >;
  removeNftTransactions!: Sequelize.HasManyRemoveAssociationsMixin<
    nftTransaction,
    nftTransactionId
  >;
  hasNftTransaction!: Sequelize.HasManyHasAssociationMixin<
    nftTransaction,
    nftTransactionId
  >;
  hasNftTransactions!: Sequelize.HasManyHasAssociationsMixin<
    nftTransaction,
    nftTransactionId
  >;
  countNftTransactions!: Sequelize.HasManyCountAssociationsMixin;

  // nftAsset hasOne nftAuction via nftAssetId
  nftAuction!: nftAuction;
  getNftAuction!: Sequelize.HasOneGetAssociationMixin<nftAuction>;
  setNftAuction!: Sequelize.HasOneSetAssociationMixin<nftAuction, nftAuctionId>;
  createNftAuction!: Sequelize.HasOneCreateAssociationMixin<nftAuction>;

  // nftAsset hasMany nftLike via nftAssetId
  nftLikes!: nftLike[];
  getNftLikes!: Sequelize.HasManyGetAssociationsMixin<nftLike>;
  setNftLikes!: Sequelize.HasManySetAssociationsMixin<nftLike, nftLikeId>;
  addNftLike!: Sequelize.HasManyAddAssociationMixin<nftLike, nftLikeId>;
  addNftLikes!: Sequelize.HasManyAddAssociationsMixin<nftLike, nftLikeId>;
  createNftLike!: Sequelize.HasManyCreateAssociationMixin<nftLike>;
  removeNftLike!: Sequelize.HasManyRemoveAssociationMixin<nftLike, nftLikeId>;
  removeNftLikes!: Sequelize.HasManyRemoveAssociationsMixin<nftLike, nftLikeId>;
  hasNftLike!: Sequelize.HasManyHasAssociationMixin<nftLike, nftLikeId>;
  hasNftLikes!: Sequelize.HasManyHasAssociationsMixin<nftLike, nftLikeId>;
  countNftLikes!: Sequelize.HasManyCountAssociationsMixin;

  public static initModel(sequelize: Sequelize.Sequelize): typeof nftAsset {
    return nftAsset.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        collectionId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: { args: 4, msg: "collectionId: Must be a valid UUID" },
          },
        },
        ownerId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: { args: 4, msg: "ownerId: Must be a valid UUID" },
          },
        },
        address: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        index: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        name: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "name: Name must not be empty" },
          },
        },
        image: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "image: Image URL must not be empty" },
          },
        },
        attributes: {
          type: DataTypes.TEXT("long"),
          allowNull: true,
        },
        likes: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          validate: {
            isInt: true,
            min: 0,
          },
        },
        price: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          validate: {
            isFloat: { msg: "price: Must be a valid number" },
            min: { args: [0], msg: "price: Price cannot be negative" },
          },
        },
        royalty: {
          type: DataTypes.FLOAT,
          allowNull: true,
          validate: {
            isFloat: { msg: "royalty: Must be a valid percentage" },
            min: { args: [0], msg: "royalty: Cannot be negative" },
            max: { args: [100], msg: "royalty: Cannot exceed 100%" },
          },
        },
        featured: {
          type: DataTypes.BOOLEAN,
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
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          validate: {
            isIn: {
              args: [[true, false]],
              msg: "status: Status must be true or false",
            },
          },
        },
      },
      {
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
      }
    );
  }
  public static associate(models: any) {
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
