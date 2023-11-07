import { genSaltSync, hashSync } from 'bcrypt'
import { Column as SequelizeColumn, Model, Table, DataType, BeforeCreate } from 'sequelize-typescript'

@Table({ modelName: 'users' })
export class User extends Model {
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
    allowNull: false,
  })
  username!: string

  @SequelizeColumn({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string

  @BeforeCreate
  static updatePassword(instance: User) {
    const salt = genSaltSync()
    instance.password = hashSync(instance.password, salt)
  }
}
