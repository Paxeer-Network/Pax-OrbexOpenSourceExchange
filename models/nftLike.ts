import * as Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";
import nftAsset from "./nftAsset";
import user from "./user";

export default class nftLike
  extends Model<nftLikeAttributes, nftLikeCreationAttributes>
  implements nftLikeAttributes
{
  id!: string;
  nftAssetId!: string; // Updated to nftAssetId
  userId!: string;
  createdAt?: Date;

  // nftLike belongsTo nftAsset via nftAssetId
  nftAsset!: nftAsset;
  getNftAsset!: Sequelize.BelongsToGetAssociationMixin<nftAsset>;
  setNftAsset!: Sequelize.BelongsToSetAssociationMixin<nftAsset, nftAssetId>;
  createNftAsset!: Sequelize.BelongsToCreateAssociationMixin<nftAsset>;

  // nftLike belongsTo user via userId
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  public static initModel(sequelize: Sequelize.Sequelize): typeof nftLike {
    return nftLike.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        nftAssetId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: { args: 4, msg: "userId: Must be a valid UUID" },
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
        modelName: "nftLike",
        tableName: "nft_like",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            fields: [{ name: "id" }],
          },
          {
            name: "nftLikeUniqueIndex",
            unique: true,
            fields: [{ name: "nftAssetId" }, { name: "userId" }],
          },
        ],
      }
    );
  }
  public static associate(models: any) {
    nftLike.belongsTo(models.nftAsset, {
      as: "nftAsset",
      foreignKey: "nftAssetId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    nftLike.belongsTo(models.user, {
      as: "user",
      foreignKey: "userId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}
