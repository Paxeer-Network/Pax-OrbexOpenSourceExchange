import * as Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";
import icoPhaseAllocation from "./icoPhaseAllocation";
import icoToken from "./icoToken";

export default class icoAllocation
  extends Model<icoAllocationAttributes, icoAllocationCreationAttributes>
  implements icoAllocationAttributes
{
  id!: string;
  name!: string;
  percentage!: number;
  tokenId!: string;
  status!: "PENDING" | "COMPLETED" | "CANCELLED" | "REJECTED";
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // icoAllocation hasMany icoPhaseAllocation via allocationId
  icoPhaseAllocations!: icoPhaseAllocation[];
  getIcoPhaseAllocations!: Sequelize.HasManyGetAssociationsMixin<icoPhaseAllocation>;
  setIcoPhaseAllocations!: Sequelize.HasManySetAssociationsMixin<
    icoPhaseAllocation,
    icoPhaseAllocationId
  >;
  addIcoPhaseAllocation!: Sequelize.HasManyAddAssociationMixin<
    icoPhaseAllocation,
    icoPhaseAllocationId
  >;
  addIcoPhaseAllocations!: Sequelize.HasManyAddAssociationsMixin<
    icoPhaseAllocation,
    icoPhaseAllocationId
  >;
  createIcoPhaseAllocation!: Sequelize.HasManyCreateAssociationMixin<icoPhaseAllocation>;
  removeIcoPhaseAllocation!: Sequelize.HasManyRemoveAssociationMixin<
    icoPhaseAllocation,
    icoPhaseAllocationId
  >;
  removeIcoPhaseAllocations!: Sequelize.HasManyRemoveAssociationsMixin<
    icoPhaseAllocation,
    icoPhaseAllocationId
  >;
  hasIcoPhaseAllocation!: Sequelize.HasManyHasAssociationMixin<
    icoPhaseAllocation,
    icoPhaseAllocationId
  >;
  hasIcoPhaseAllocations!: Sequelize.HasManyHasAssociationsMixin<
    icoPhaseAllocation,
    icoPhaseAllocationId
  >;
  countIcoPhaseAllocations!: Sequelize.HasManyCountAssociationsMixin;
  // icoAllocation belongsTo icoToken via tokenId
  token!: icoToken;
  getToken!: Sequelize.BelongsToGetAssociationMixin<icoToken>;
  setToken!: Sequelize.BelongsToSetAssociationMixin<icoToken, icoTokenId>;
  createToken!: Sequelize.BelongsToCreateAssociationMixin<icoToken>;

  public static initModel(sequelize: Sequelize.Sequelize): typeof icoAllocation {
    return icoAllocation.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "name: Name cannot be empty" },
          },
        },
        percentage: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isFloat: { msg: "percentage: Percentage must be a valid number" },
          },
        },
        tokenId: {
          type: DataTypes.UUID,
          allowNull: false,
          unique: "icoAllocationTokenIdFkey",
          validate: {
            isUUID: { args: 4, msg: "tokenId: Token ID must be a valid UUID" },
          },
        },
        status: {
          type: DataTypes.ENUM("PENDING", "COMPLETED", "CANCELLED", "REJECTED"),
          allowNull: false,
          defaultValue: "PENDING",
          validate: {
            isIn: {
              args: [["PENDING", "COMPLETED", "CANCELLED", "REJECTED"]],
              msg: "status: Status must be PENDING, COMPLETED, CANCELLED, or REJECTED",
            },
          },
        },
      },
      {
        sequelize,
        modelName: "icoAllocation",
        tableName: "ico_allocation",
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
            name: "icoAllocationTokenIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "tokenId" }],
          },
        ],
      }
    );
  }
  public static associate(models: any) {
    icoAllocation.hasMany(models.icoPhaseAllocation, {
      as: "icoPhaseAllocations",
      foreignKey: "allocationId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    icoAllocation.belongsTo(models.icoToken, {
      as: "token",
      foreignKey: "tokenId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}
