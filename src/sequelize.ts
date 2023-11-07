import { Sequelize } from 'sequelize-typescript'
import { EnvName } from './interfaces'
import { User, HistoricalPrice, PortfolioAsset, Portfolio, Token } from './models'

const NODE_ENV: EnvName = (process.env.NODE_ENV as EnvName) || 'development'

export default async function sequelize() {
  const connection = new Sequelize({
    dialect: 'postgres',
    repositoryMode: true,
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT) ?? 5432,
    models: [User, Token, Portfolio, PortfolioAsset, HistoricalPrice],
  })

  await connection.authenticate()
  await connection.sync({
    alter: NODE_ENV === 'development',
    force: NODE_ENV === 'test',
  })

  return connection
}
