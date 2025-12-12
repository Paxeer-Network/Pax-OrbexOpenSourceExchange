import * as Sequelize from "sequelize";
import { DataTypes, Model } from "sequelize";
import icoAllocation from "./icoAllocation";
import icoPhase from "./icoPhase";

export default class icoPhaseAllocation
  extends Model<
    icoPhaseAllocationAttributes,
    icoPhaseAllocationCreationAttributes
  >
  implements icoPhaseAllocationAttributes
{
  id!: string;
  allocationId!: string;
  phaseId!: string;
  percentage!: number;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // icoPhaseAllocation belongsTo icoAllocation via allocationId
  allocation!: icoAllocation;
  getAllocation!: Sequelize.BelongsToGetAssociationMixin<icoAllocation>;
  setAllocation!: Sequelize.BelongsToSetAssociationMixin<
    icoAllocation,
    icoAllocationId
  >;
  createAllocation!: Sequelize.BelongsToCreateAssociationMixin<icoAllocation>;
  // icoPhaseAllocation belongsTo icoPhase via phaseId
  phase!: icoPhase;
  getPhase!: Sequelize.BelongsToGetAssociationMixin<icoPhase>;
  setPhase!: Sequelize.BelongsToSetAssociationMixin<icoPhase, icoPhaseId>;
  createPhase!: Sequelize.BelongsToCreateAssociationMixin<icoPhase>;

  public static initModel(sequelize: Sequelize.Sequelize): typeof icoPhaseAllocation {
    return icoPhaseAllocation.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        allocationId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: {
              args: 4,
              msg: "allocationId: Allocation ID must be a valid UUID",
            },
          },
        },
        phaseId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: { args: 4, msg: "phaseId: Phase ID must be a valid UUID" },
          },
        },
        percentage: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isFloat: { msg: "percentage: Percentage must be a valid number" },
          },
        },
      },
      {
        sequelize,
        modelName: "icoPhaseAllocation",
        tableName: "ico_phase_allocation",
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
            name: "icoPhaseAllocationAllocationIdFkey",
            using: "BTREE",
            fields: [{ name: "allocationId" }],
          },
          {
            name: "icoPhaseAllocationPhaseIdFkey",
            using: "BTREE",
            fields: [{ name: "phaseId" }],
          },
        ],
      }
    );
  }
  public static associate(models: any) {
    icoPhaseAllocation.belongsTo(models.icoAllocation, {
      as: "allocation",
      foreignKey: "allocationId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    icoPhaseAllocation.belongsTo(models.icoPhase, {
      as: "phase",
      foreignKey: "phaseId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  }
}
