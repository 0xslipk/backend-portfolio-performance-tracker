import { User } from './models'
import { UserService, PortfolioService } from './services'

export type EnvName = 'development' | 'production' | 'test'

export interface ApolloContext {
  userService: UserService
  portfolioService: PortfolioService
  getAuthorizationToken: (user: User) => Promise<string>
  isAuthorized: () => Promise<boolean>
  getLoggedUserId: () => Promise<number>
}

export type CreateUserArgs = {
  username: string
  password: string
}

export type LoginArgs = CreateUserArgs

export type AssetAmountBased = {
  name: string
  amount: number
}

export type GetPortfolioArgs = {
  portfolioId: number
}

export type CreatePortfolioByAmountArgs = {
  name: string
  assets: AssetAmountBased[]
}

export type CreatePortfolioByWeightArgs = {
  name: string
  assets: string[]
}

export type AddAssetsToPortfolioByAmountArgs = GetPortfolioArgs & {
  assets: AssetAmountBased[]
}

export type AddAssetsToPortfolioByWeightArgs = GetPortfolioArgs & {
  assets: string[]
}

export type RemoveAssetsToPortfolioArgs = AddAssetsToPortfolioByWeightArgs
