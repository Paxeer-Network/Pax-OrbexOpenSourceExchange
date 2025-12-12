import * as Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";
import rolePermission from "./rolePermission";

export default class permission
  extends Model<permissionAttributes, permissionCreationAttributes>
  implements permissionAttributes
{
  id!: number;
  name!: string;

  // permission hasMany rolePermission via permissionId
  rolePermissions!: rolePermission[];
  getRolepermissions!: Sequelize.HasManyGetAssociationsMixin<rolePermission>;
  setRolepermissions!: Sequelize.HasManySetAssociationsMixin<
    rolePermission,
    rolePermissionId
  >;
  addRolepermission!: Sequelize.HasManyAddAssociationMixin<
    rolePermission,
    rolePermissionId
  >;
  addRolepermissions!: Sequelize.HasManyAddAssociationsMixin<
    rolePermission,
    rolePermissionId
  >;
  createRolepermission!: Sequelize.HasManyCreateAssociationMixin<rolePermission>;
  removeRolepermission!: Sequelize.HasManyRemoveAssociationMixin<
    rolePermission,
    rolePermissionId
  >;
  removeRolepermissions!: Sequelize.HasManyRemoveAssociationsMixin<
    rolePermission,
    rolePermissionId
  >;
  hasRolepermission!: Sequelize.HasManyHasAssociationMixin<
    rolePermission,
    rolePermissionId
  >;
  hasRolepermissions!: Sequelize.HasManyHasAssociationsMixin<
    rolePermission,
    rolePermissionId
  >;
  countRolepermissions!: Sequelize.HasManyCountAssociationsMixin;

  public static initModel(sequelize: Sequelize.Sequelize): typeof permission {
    return permission.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          validate: {
            notEmpty: { msg: "name: Name cannot be empty" },
          },
        },
      },
      {
        sequelize,
        modelName: "permission",
        tableName: "permission",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
        ],
      }
    );
  }

  public static associate(models: any) {
    permission.hasMany(models.rolePermission, {
      as: "rolePermissions",
      foreignKey: "permissionId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    permission.belongsToMany(models.role, {
      through: models.rolePermission,
      as: "roles",
      foreignKey: "permissionId",
      otherKey: "roleId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}
