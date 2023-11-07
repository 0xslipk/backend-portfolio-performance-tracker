import { Column as SequelizeColumn, Model, Table, DataType } from 'sequelize-typescript'

@Table({ modelName: 'tokens' })
export class Token extends Model {
  @SequelizeColumn({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    allowNull: false,
  })
  id!: number

  @SequelizeColumn({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  name!: string
}
