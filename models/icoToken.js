"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class icoToken extends sequelize_1.Model {
    static initModel(sequelize) {
        return icoToken.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            projectId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: "projectId: Project ID must be a valid UUID",
                    },
                },
            },
            name: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "name: Name cannot be empty" },
                },
            },
            chain: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "chain: Chain cannot be empty" },
                },
            },
            currency: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "currency: Currency cannot be empty" },
                },
            },
            purchaseCurrency: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                defaultValue: "ETH",
                validate: {
                    notEmpty: {
                        msg: "purchaseCurrency: Purchase currency cannot be empty",
                    },
                },
            },
            purchaseWalletType: {
                type: sequelize_1.DataTypes.ENUM("FIAT", "SPOT", "ECO"),
                allowNull: false,
                defaultValue: "SPOT",
                validate: {
                    isIn: {
                        args: [["FIAT", "SPOT", "ECO"]],
                        msg: "purchaseWalletType: Purchase wallet type must be one of FIAT, SPOT, ECO",
                    },
                },
            },
            address: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "address: Address cannot be empty" },
                },
            },
            totalSupply: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: { msg: "totalSupply: Total supply must be an integer" },
                },
            },
            description: {
                type: sequelize_1.DataTypes.TEXT("long"),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "description: Description cannot be empty" },
                },
            },
            image: {
                type: sequelize_1.DataTypes.STRING(191),
                allowNull: false,
                validate: {
                    notEmpty: { msg: "image: Image cannot be empty" },
                },
            },
            status: {
                type: sequelize_1.DataTypes.ENUM("PENDING", "ACTIVE", "COMPLETED", "REJECTED", "CANCELLED"),
                allowNull: false,
                defaultValue: "PENDING",
                validate: {
                    isIn: {
                        args: [
                            ["PENDING", "ACTIVE", "COMPLETED", "REJECTED", "CANCELLED"],
                        ],
                        msg: "status: Status must be one of PENDING, ACTIVE, COMPLETED, REJECTED, CANCELLED",
                    },
                },
            },
        }, {
            sequelize,
            modelName: "icoToken",
            tableName: "ico_token",
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
                    name: "icoTokenProjectIdFkey",
                    using: "BTREE",
                    fields: [{ name: "projectId" }],
                },
            ],
        });
    }
    static associate(models) {
        icoToken.belongsTo(models.icoProject, {
            as: "project",
            foreignKey: "projectId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        icoToken.hasOne(models.icoAllocation, {
            as: "icoAllocation",
            foreignKey: "tokenId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        icoToken.hasMany(models.icoPhase, {
            as: "icoPhases",
            foreignKey: "tokenId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = icoToken;
