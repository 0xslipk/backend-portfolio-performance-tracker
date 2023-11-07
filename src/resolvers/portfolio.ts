import { UnAuthorizedError, PortfolioNotFoundError, PortfolioUnableToCreateError, PortfolioUnableToUpdateError } from '../errors'
import {
  ApolloContext,
  GetPortfolioArgs,
  AddAssetsToPortfolioByAmountArgs,
  AddAssetsToPortfolioByWeightArgs,
  RemoveAssetsToPortfolioArgs,
  AssetAmountBased,
  CreatePortfolioByAmountArgs,
  CreatePortfolioByWeightArgs,
} from '../interfaces'
import { Portfolio } from '../models'

const parse = (portfolio: Portfolio) => {
  return {
    id: portfolio.id,
    name: portfolio.name,
    assets: portfolio.assets.map((asset) => ({
      quantity: asset.quantity,
      initialPrice: asset.initialPrice,
      token: asset.token.name,
    })),
  }
}

function PortfolioResult(portfolio: Portfolio) {
  return {
    __typename: 'Portfolio',
    ...parse(portfolio),
  }
}

async function addAssetsToPortfolio(portfolioId: number, assets: AssetAmountBased[] | string[], context: ApolloContext) {
  const isAuthorized = await context.isAuthorized()

  if (!isAuthorized) {
    return UnAuthorizedError()
  }

  const userId = await context.getLoggedUserId()
  const portfolio = await context.portfolioService.addAssetsToPortfolio(portfolioId, userId, assets)

  if (!portfolio) {
    return PortfolioUnableToUpdateError(portfolioId)
  }

  return PortfolioResult(portfolio)
}

async function createPortfolio(name: string, assets: AssetAmountBased[] | string[], context: ApolloContext) {
  const isAuthorized = await context.isAuthorized()

  if (!isAuthorized) {
    return UnAuthorizedError()
  }

  const userId = await context.getLoggedUserId()
  const portfolio = await context.portfolioService.createPortfolio(name, assets, userId)

  if (!portfolio) {
    return PortfolioUnableToCreateError()
  }

  return PortfolioResult(portfolio)
}

export default {
  Query: {
    async portfolios(_parent: undefined, _args: undefined, context: ApolloContext) {
      const isAuthorized = await context.isAuthorized()

      if (!isAuthorized) {
        return UnAuthorizedError()
      }

      const userId = await context.getLoggedUserId()
      const portfolios = await context.portfolioService.getPortfolios(userId)

      return {
        portfolios: portfolios.map((portfolio) => parse(portfolio)),
        total: portfolios.length,
      }
    },
    async getPortfolioById(_parent: undefined, args: GetPortfolioArgs, context: ApolloContext) {
      const isAuthorized = await context.isAuthorized()

      if (!isAuthorized) {
        return UnAuthorizedError()
      }

      const userId = await context.getLoggedUserId()
      const portfolio = await context.portfolioService.getPortfolio(args.portfolioId, userId)

      if (!portfolio) {
        return PortfolioNotFoundError(args.portfolioId)
      }

      return PortfolioResult(portfolio)
    },
  },
  Mutation: {
    async createPortfolioByAmount(_parent: undefined, args: CreatePortfolioByAmountArgs, context: ApolloContext) {
      return createPortfolio(args.name, args.assets, context)
    },
    async createPortfolioByWeight(_parent: undefined, args: CreatePortfolioByWeightArgs, context: ApolloContext) {
      return createPortfolio(args.name, args.assets, context)
    },
    addAssetsToPortfolioByAmount(_parent: undefined, args: AddAssetsToPortfolioByAmountArgs, context: ApolloContext) {
      return addAssetsToPortfolio(args.portfolioId, args.assets, context)
    },
    addAssetsToPortfolioByWeight(_parent: undefined, args: AddAssetsToPortfolioByWeightArgs, context: ApolloContext) {
      return addAssetsToPortfolio(args.portfolioId, args.assets, context)
    },
    async removeAssetsToPortfolio(_parent: undefined, args: RemoveAssetsToPortfolioArgs, context: ApolloContext) {
      const isAuthorized = await context.isAuthorized()

      if (!isAuthorized) {
        return UnAuthorizedError()
      }

      const userId = await context.getLoggedUserId()
      const portfolio = await context.portfolioService.removeAssetsToPortfolio(args.portfolioId, userId, args.assets)

      if (!portfolio) {
        return PortfolioUnableToUpdateError(args.portfolioId)
      }

      return PortfolioResult(portfolio)
    },
  },
}
