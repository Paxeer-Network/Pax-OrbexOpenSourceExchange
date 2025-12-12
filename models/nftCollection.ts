import * as Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";
import nftAsset from "./nftAsset";
import nftComment from "./nftComment";
import nftFollow from "./nftFollow";
import user from "./user";

export default class nftCollection
  extends Model<nftCollectionAttributes, nftCollectionCreationAttributes>
  implements nftCollectionAttributes
{
  id!: string;
  creatorId!: string;
  name!: string;
  description!: string;
  chain!: string;
  image!: string;
  featured?: boolean;
  views!: number;
  links?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // nftCollection belongsTo user via creatorId
  creator!: user;
  getCreator!: Sequelize.BelongsToGetAssociationMixin<user>;
  setCreator!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createCreator!: Sequelize.BelongsToCreateAssociationMixin<user>;

  // nftCollection hasMany nftAsset via collectionId
  nftAssets!: nftAsset[];
  getNftAssets!: Sequelize.HasManyGetAssociationsMixin<nftAsset>;
  setNftAssets!: Sequelize.HasManySetAssociationsMixin<nftAsset, nftAssetId>;
  addNftAsset!: Sequelize.HasManyAddAssociationMixin<nftAsset, nftAssetId>;
  addNftAssets!: Sequelize.HasManyAddAssociationsMixin<nftAsset, nftAssetId>;
  createNftAsset!: Sequelize.HasManyCreateAssociationMixin<nftAsset>;
  removeNftAsset!: Sequelize.HasManyRemoveAssociationMixin<
    nftAsset,
    nftAssetId
  >;
  removeNftAssets!: Sequelize.HasManyRemoveAssociationsMixin<
    nftAsset,
    nftAssetId
  >;
  hasNftAsset!: Sequelize.HasManyHasAssociationMixin<nftAsset, nftAssetId>;
  hasNftAssets!: Sequelize.HasManyHasAssociationsMixin<nftAsset, nftAssetId>;
  countNftAssets!: Sequelize.HasManyCountAssociationsMixin;

  // nftCollection hasMany nftComment via collectionId
  nftComments!: nftComment[];
  getNftComments!: Sequelize.HasManyGetAssociationsMixin<nftComment>;
  setNftComments!: Sequelize.HasManySetAssociationsMixin<
    nftComment,
    nftCommentId
  >;
  addNftComment!: Sequelize.HasManyAddAssociationMixin<
    nftComment,
    nftCommentId
  >;
  addNftComments!: Sequelize.HasManyAddAssociationsMixin<
    nftComment,
    nftCommentId
  >;
  createNftComment!: Sequelize.HasManyCreateAssociationMixin<nftComment>;
  removeNftComment!: Sequelize.HasManyRemoveAssociationMixin<
    nftComment,
    nftCommentId
  >;
  removeNftComments!: Sequelize.HasManyRemoveAssociationsMixin<
    nftComment,
    nftCommentId
  >;
  hasNftComment!: Sequelize.HasManyHasAssociationMixin<
    nftComment,
    nftCommentId
  >;
  hasNftComments!: Sequelize.HasManyHasAssociationsMixin<
    nftComment,
    nftCommentId
  >;
  countNftComments!: Sequelize.HasManyCountAssociationsMixin;

  // nftCollection hasMany nftFollow via collectionId
  nftFollows!: nftFollow[];
  getNftFollows!: Sequelize.HasManyGetAssociationsMixin<nftFollow>;
  setNftFollows!: Sequelize.HasManySetAssociationsMixin<nftFollow, nftFollowId>;
  addNftFollow!: Sequelize.HasManyAddAssociationMixin<nftFollow, nftFollowId>;
  addNftFollows!: Sequelize.HasManyAddAssociationsMixin<nftFollow, nftFollowId>;
  createNftFollow!: Sequelize.HasManyCreateAssociationMixin<nftFollow>;
  removeNftFollow!: Sequelize.HasManyRemoveAssociationMixin<
    nftFollow,
    nftFollowId
  >;
  removeNftFollows!: Sequelize.HasManyRemoveAssociationsMixin<
    nftFollow,
    nftFollowId
  >;
  hasNftFollow!: Sequelize.HasManyHasAssociationMixin<nftFollow, nftFollowId>;
  hasNftFollows!: Sequelize.HasManyHasAssociationsMixin<nftFollow, nftFollowId>;
  countNftFollows!: Sequelize.HasManyCountAssociationsMixin;

  public static initModel(sequelize: Sequelize.Sequelize): typeof nftCollection {
    return nftCollection.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        creatorId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: { args: 4, msg: "creatorId: Must be a valid UUID" },
          },
        },
        name: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "name: Name must not be empty" },
          },
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notEmpty: { msg: "description: Description must not be empty" },
          },
        },
        chain: {
          type: DataTypes.STRING(50),
          allowNull: false,
          defaultValue: "ETH",
          validate: {
            notEmpty: { msg: "chain: Chain must not be empty" },
          },
        },
        image: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notEmpty: { msg: "image: Image must not be empty" },
          },
        },
        views: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          validate: {
            isInt: true,
            min: 0,
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
        links: {
          type: DataTypes.TEXT("long"),
          allowNull: true,
        },
      },
      {
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
      }
    );
  }
  public static associate(models: any) {
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
