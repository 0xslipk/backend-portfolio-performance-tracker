import { Column as SequelizeColumn, Model, Table, DataType, BelongsTo, Column, ForeignKey, HasMany } from 'sequelize-typescript'
import { PortfolioAsset } from './portfolio-asset'
import { User } from './user'

@Table({ modelName: 'portfolios' })
export class Portfolio extends Model {
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
  name!: string

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  userId!: number

  @BelongsTo(() => User)
  user!: User

  @HasMany(() => PortfolioAsset)
  assets!: PortfolioAsset[]
}
