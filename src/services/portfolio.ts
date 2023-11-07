import { BaseLogger as PinoLogger } from 'pino'
import { Repository, Sequelize } from 'sequelize-typescript'
import { AssetAmountBased } from '../interfaces'
import { Token, Portfolio, PortfolioAsset, HistoricalPrice } from '../models'

export class PortfolioService {
  private readonly logger: PinoLogger
  private readonly tokenModel: Repository<Token>
  private readonly portfolioModel: Repository<Portfolio>
  private readonly portfolioAssetModel: Repository<PortfolioAsset>
  private readonly historicalPriceModel: Repository<HistoricalPrice>

  constructor(connection: Sequelize, logger: PinoLogger) {
    this.logger = logger
    this.tokenModel = connection.getRepository(Token)
    this.portfolioModel = connection.getRepository(Portfolio)
    this.portfolioAssetModel = connection.getRepository(PortfolioAsset)
    this.historicalPriceModel = connection.getRepository(HistoricalPrice)
  }

  private async getToken(name: string): Promise<Token> {
    const token = await this.tokenModel.findOne<Token>({
      where: {
        name,
      },
    })

    if (!token) {
      throw new Error(`Token ${name} not found`)
    }

    return token
  }

  private async getTokenCurrentPrice(tokenId: number): Promise<number> {
    const price = await this.historicalPriceModel.findOne<HistoricalPrice>({
      where: {
        tokenId,
      },
      order: [['createdAt', 'DESC']],
    })

    if (!price) {
      throw new Error(`No price found for token ${tokenId}`)
    }

    return price.closePrice
  }

  private async createPortfolioAsset(portfolioId: number, tokenName: string, quantity: number): Promise<PortfolioAsset> {
    const token = await this.getToken(tokenName)
    const initialPrice = await this.getTokenCurrentPrice(token.id)
    const portfolioAsset = this.portfolioAssetModel.create({
      portfolioId,
      tokenId: token.id,
      quantity,
      initialPrice,
    })

    return portfolioAsset
  }

  private async updatePortfolioAssetQuantity(id: number, quantity: number): Promise<void> {
    const asset = await this.portfolioAssetModel.findOne<PortfolioAsset>({
      where: {
        id,
      },
    })

    if (asset) {
      asset.quantity = quantity

      await asset.save()
    }
  }

  private parseAssets(
    assets: AssetAmountBased[] | string[],
    length = assets.length,
  ): { isAmountBased: boolean; assets: AssetAmountBased[] } {
    let isAmountBased = false
    let isWeightBased = false
    const result: AssetAmountBased[] = []

    assets.forEach((asset) => {
      if (typeof asset === 'string') {
        isWeightBased = true

        result.push({
          name: asset,
          amount: 1 / length,
        })
      } else {
        isAmountBased = true

        result.push(asset)
      }
    })

    if (isAmountBased && isWeightBased) {
      throw new Error('Assets must be all amount-based or all weight-based')
    }

    return { isAmountBased, assets: result }
  }

  public async createPortfolio(name: string, _assets: AssetAmountBased[] | string[], userId: number): Promise<Portfolio | null> {
    try {
      const portfolio = await this.portfolioModel.create({
        name,
        userId,
      })
      const { assets } = this.parseAssets(_assets)

      await Promise.all(assets.map((asset) => this.createPortfolioAsset(portfolio.id, asset.name, asset.amount)))

      return this.getPortfolio(portfolio.id, userId)
    } catch (err) {
      this.logger.error({ err }, 'Error trying to create portfolio')

      return null
    }
  }

  public async getPortfolio(id: number, userId: number): Promise<Portfolio | null> {
    try {
      const portfolio = await this.portfolioModel.findOne<Portfolio>({
        where: {
          id,
          userId,
        },
        include: [
          {
            association: 'assets',
            include: ['token'],
          },
        ],
      })

      return portfolio
    } catch (err) {
      this.logger.error({ err }, 'Error trying to get portfolio %d', id)

      return null
    }
  }

  public async getPortfolios(userId: number): Promise<Portfolio[]> {
    try {
      const portfolios = await this.portfolioModel.findAll<Portfolio>({
        where: {
          userId,
        },
        include: [
          {
            association: 'assets',
            include: ['token'],
          },
        ],
      })

      return portfolios
    } catch (err) {
      this.logger.error({ err }, 'Error trying to get portfolios')

      return []
    }
  }

  public async addAssetsToPortfolio(id: number, userId: number, _assets: AssetAmountBased[] | string[]): Promise<Portfolio | null> {
    try {
      const portfolio = await this.getPortfolio(id, userId)

      if (!portfolio) {
        throw new Error(`Portfolio ${id} not found`)
      }

      const isWeightBased = portfolio.assets.reduce((acc, asset) => acc + asset.quantity, 0) === 1
      const { assets, isAmountBased } = this.parseAssets(_assets, portfolio.assets.length + _assets.length)

      if (isWeightBased && isAmountBased) {
        throw new Error('Assets must be all amount-based or all weight-based')
      }

      await Promise.all(assets.map((asset) => this.createPortfolioAsset(portfolio.id, asset.name, asset.amount)))

      if (isWeightBased) {
        const weight = 1 / (portfolio.assets.length + assets.length)

        await Promise.all(portfolio.assets.map((asset) => this.updatePortfolioAssetQuantity(asset.id, weight)))
      }

      return this.getPortfolio(portfolio.id, userId)
    } catch (err) {
      this.logger.error({ err }, 'Error trying to add assets to portfolio %d', id)

      return null
    }
  }

  public async removeAssetsToPortfolio(id: number, userId: number, assets: string[]): Promise<Portfolio | null> {
    try {
      const portfolio = await this.getPortfolio(id, userId)

      if (!portfolio) {
        throw new Error(`Portfolio ${id} not found`)
      }

      const isWeightBased = portfolio.assets.reduce((acc, asset) => acc + asset.quantity, 0) === 1
      const tokens = await Promise.all(assets.map((asset) => this.getToken(asset)))

      await Promise.all(
        tokens.map((token) => this.portfolioAssetModel.destroy({ where: { portfolioId: portfolio.id, tokenId: token.id } })),
      )

      if (isWeightBased) {
        const weight = 1 / Math.abs(portfolio.assets.length - assets.length)

        await Promise.all(portfolio.assets.map((asset) => this.updatePortfolioAssetQuantity(asset.id, weight)))
      }

      return this.getPortfolio(portfolio.id, userId)
    } catch (err) {
      this.logger.error({ err }, 'Error trying to remove assets to portfolio %d', id)

      return null
    }
  }
}
