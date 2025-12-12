"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class providerUser extends sequelize_1.Model {
    static initModel(sequelize) {
        return providerUser.init({
            id: {
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            userId: {
                type: sequelize_1.DataTypes.UUID,
                allowNull: false,
                validate: {
                    notNull: { msg: "userId: User ID cannot be null" },
                    isUUID: { args: 4, msg: "userId: User ID must be a valid UUID" },
                },
            },
            providerUserId: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
                unique: "providerUserId",
                validate: {
                    notNull: {
                        msg: "providerUserId: Provider user ID cannot be null",
                    },
                    len: {
                        args: [1, 255],
                        msg: "providerUserId: Provider user ID must be between 1 and 255 characters",
                    },
                },
            },
            provider: {
                type: sequelize_1.DataTypes.ENUM("GOOGLE", "WALLET"),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [["GOOGLE", "WALLET"]],
                        msg: "provider: Provider must be 'GOOGLE' or 'WALLET'",
                    },
                },
            },
        }, {
            sequelize,
            modelName: "providerUser",
            tableName: "provider_user",
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
                    name: "providerUserId",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "providerUserId" }],
                },
                {
                    name: "ProviderUserUserIdFkey",
                    using: "BTREE",
                    fields: [{ name: "userId" }],
                },
            ],
            hooks: {
                beforeCreate: async (providerUser) => {
                    if (!providerUser.id) {
                        const { v4: uuidv4 } = await Promise.resolve().then(() => __importStar(require('uuid')));
                        providerUser.id = uuidv4();
                    }
                },
            },
        });
    }
    static associate(models) {
        providerUser.belongsTo(models.user, {
            as: "user",
            foreignKey: "userId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    }
}
exports.default = providerUser;
