import * as Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";
import permission from "./permission";
import role from "./role";

export default class rolePermission
  extends Model<rolePermissionAttributes, rolePermissionCreationAttributes>
  implements rolePermissionAttributes
{
  id!: number;
  roleId!: number;
  permissionId!: number;

  // rolePermission belongsTo permission via permissionId
  permission!: permission;
  getPermission!: Sequelize.BelongsToGetAssociationMixin<permission>;
  setPermission!: Sequelize.BelongsToSetAssociationMixin<
    permission,
    permissionId
  >;
  createPermission!: Sequelize.BelongsToCreateAssociationMixin<permission>;
  // rolePermission belongsTo role via roleId
  role!: role;
  getRole!: Sequelize.BelongsToGetAssociationMixin<role>;
  setRole!: Sequelize.BelongsToSetAssociationMixin<role, roleId>;
  createRole!: Sequelize.BelongsToCreateAssociationMixin<role>;

  public static initModel(sequelize: Sequelize.Sequelize): typeof rolePermission {
    return rolePermission.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        roleId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        permissionId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "rolePermission",
        tableName: "role_permission",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "RolePermissionPermissionIdFkey",
            using: "BTREE",
            fields: [{ name: "permissionId" }],
          },
          {
            name: "RolePermissionRoleIdFkey",
            using: "BTREE",
            fields: [{ name: "roleId" }],
          },
        ],
      }
    );
  }

  public static associate(models: any) {
    rolePermission.belongsTo(models.role, {
      as: "role",
      foreignKey: "roleId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    rolePermission.belongsTo(models.permission, {
      as: "permission",
      foreignKey: "permissionId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}
