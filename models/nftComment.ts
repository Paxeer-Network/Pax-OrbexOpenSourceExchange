import * as Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";
import nftCollection from "./nftCollection";
import user from "./user";

export default class nftComment
  extends Model<nftCommentAttributes, nftCommentCreationAttributes>
  implements nftCommentAttributes
{
  id!: string;
  collectionId!: string; // Updated association field
  userId!: string;
  comment!: string;
  createdAt?: Date;

  // nftComment belongsTo nftCollection via collectionId
  collection!: nftCollection;
  getCollection!: Sequelize.BelongsToGetAssociationMixin<nftCollection>;
  setCollection!: Sequelize.BelongsToSetAssociationMixin<
    nftCollection,
    nftCollectionId
  >;
  createCollection!: Sequelize.BelongsToCreateAssociationMixin<nftCollection>;

  // nftComment belongsTo user via userId
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  public static initModel(sequelize: Sequelize.Sequelize): typeof nftComment {
    return nftComment.init(
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
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: { args: 4, msg: "userId: Must be a valid UUID" },
          },
        },
        comment: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notEmpty: { msg: "comment: Comment must not be empty" },
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
        modelName: "nftComment",
        tableName: "nft_comment",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            fields: [{ name: "id" }],
          },
          {
            name: "nftCommentCollectionIdIndex",
            fields: [{ name: "collectionId" }],
          },
          {
            name: "nftCommentUserIdIndex",
            fields: [{ name: "userId" }],
          },
        ],
      }
    );
  }
  public static associate(models: any) {
    nftComment.belongsTo(models.nftCollection, {
      as: "collection",
      foreignKey: "collectionId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    nftComment.belongsTo(models.user, {
      as: "user",
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}
