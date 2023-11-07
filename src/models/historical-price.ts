import { Column as SequelizeColumn, Model, Table, DataType, BelongsTo, Column, ForeignKey } from 'sequelize-typescript'
import { Token } from './token'

@Table({ modelName: 'historical_prices' })
export class HistoricalPrice extends Model {
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
  openPrice!: number

  @SequelizeColumn({
    type: DataType.DECIMAL,
  })
  highPrice!: number

  @SequelizeColumn({
    type: DataType.DECIMAL,
  })
  lowPrice!: number

  @SequelizeColumn({
    type: DataType.DECIMAL,
  })
  closePrice!: number

  @SequelizeColumn({
    type: DataType.DECIMAL,
  })
  volume!: number

  @SequelizeColumn({
    type: DataType.DECIMAL,
  })
  marketCap!: number

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
