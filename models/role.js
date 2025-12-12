"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class role extends sequelize_1.Model {
    static initModel(sequelize) {
        return role.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
                unique: "roleNameKey",
                validate: {
                    notEmpty: { msg: "name: Name cannot be empty" },
                },
            },
        }, {
            sequelize,
            modelName: "role",
            tableName: "role",
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "id" }],
                },
                {
                    name: "roleNameKey",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "name" }],
                },
            ],
        });
    }
    static associate(models) {
        role.hasMany(models.rolePermission, {
            as: "rolePermissions",
            foreignKey: "roleId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        role.belongsToMany(models.permission, {
            through: models.rolePermission,
            as: "permissions",
            foreignKey: "roleId",
            otherKey: "permissionId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        role.hasMany(models.user, {
            as: "users",
            foreignKey: "roleId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = role;
