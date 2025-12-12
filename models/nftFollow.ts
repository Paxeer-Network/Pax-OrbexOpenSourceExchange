import * as Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";
import nftCollection from "./nftCollection";
import user from "./user";

export default class nftFollow
  extends Model<nftFollowAttributes, nftFollowCreationAttributes>
  implements nftFollowAttributes
{
  id!: string;
  collectionId!: string; // Updated association field
  followerId!: string;
  createdAt?: Date;

  // nftFollow belongsTo nftCollection via collectionId
  collection!: nftCollection;
  getCollection!: Sequelize.BelongsToGetAssociationMixin<nftCollection>;
  setCollection!: Sequelize.BelongsToSetAssociationMixin<
    nftCollection,
    nftCollectionId
  >;
  createCollection!: Sequelize.BelongsToCreateAssociationMixin<nftCollection>;

  // nftFollow belongsTo user via followerId
  follower!: user;
  getFollower!: Sequelize.BelongsToGetAssociationMixin<user>;
  setFollower!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createFollower!: Sequelize.BelongsToCreateAssociationMixin<user>;

  public static initModel(sequelize: Sequelize.Sequelize): typeof nftFollow {
    return nftFollow.init(
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
        },
        followerId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: { args: 4, msg: "followerId: Must be a valid UUID" },
          },
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        sequelize,
        modelName: "nftFollow",
        tableName: "nft_follow",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            fields: [{ name: "id" }],
          },
          {
            name: "nftFollowCollectionUniqueIndex",
            unique: true,
            fields: [{ name: "collectionId" }, { name: "followerId" }],
          },
        ],
      }
    );
  }
  public static associate(models: any) {
    nftFollow.belongsTo(models.nftCollection, {
      as: "collection",
      foreignKey: "collectionId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    nftFollow.belongsTo(models.user, {
      as: "follower",
      foreignKey: "followerId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}
