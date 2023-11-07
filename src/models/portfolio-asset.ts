import { Column as SequelizeColumn, Model, Table, DataType, BelongsTo, Column, ForeignKey } from 'sequelize-typescript'
import { Portfolio } from './portfolio'
import { Token } from './token'

@Table({ modelName: 'portfolio_assets' })
export class PortfolioAsset extends Model {
  @SequelizeColumn({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    autoIncrementIdentity: true,
    allowNull: false,
  })
  id!: number

  @SequelizeColumn({
    type: DataType.DECIMAL,
  })
  quantity!: number

  @SequelizeColumn({
    type: DataType.DECIMAL,
  })
  initialPrice!: number

  @ForeignKey(() => Portfolio)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  portfolioId!: number

  @BelongsTo(() => Portfolio)
  portfolio!: Portfolio

  @ForeignKey(() => Token)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  tokenId!: number

  @BelongsTo(() => Token)
  token!: Token
}
