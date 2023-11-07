const portfolioType = `
  type Asset {
    quantity: Float!
    initialPrice: Float!
    token: String!
  }

  type Portfolio {
    id: ID!
    name: String!
    assets: [Asset]
  }

  type Portfolios {
    portfolios: [Portfolio]
    total: Int!
  }
  
  input AssetAmountBased {
    name: String!
    amount: Int!
  }

  type PortfolioNotFoundError implements Error {
    message: String!
    portfolioId: ID!
  }
  
  type PortfolioUnableToCreateError implements Error {
    message: String!
  }
  
  type PortfolioUnableToUpdateError implements Error {
    message: String!
    portfolioId: ID!
  }
  
  union GetPortfolioResult = Portfolio | PortfolioNotFoundError | UnAuthorizedError
  
  union CreatePortfolioResult = Portfolio | PortfolioUnableToCreateError | UnAuthorizedError
  
  union AddAssetsToPortfolioResult = Portfolio | PortfolioUnableToUpdateError | UnAuthorizedError
  
  union RemoveAssetsToPortfolioResult = Portfolio | PortfolioUnableToUpdateError | UnAuthorizedError
  
  type Query {
		portfolios: Portfolios
    getPortfolioById(portfolioId: ID!): GetPortfolioResult
	}
  
  type Mutation {
    createPortfolioByAmount(name: String!, assets: [AssetAmountBased]): CreatePortfolioResult
    createPortfolioByWeight(name: String!, assets: [String]): CreatePortfolioResult
    addAssetsToPortfolioByAmount(portfolioId: ID!, assets: [AssetAmountBased]): AddAssetsToPortfolioResult
    addAssetsToPortfolioByWeight(portfolioId: ID!, assets: [String]): AddAssetsToPortfolioResult
    removeAssetsToPortfolio(portfolioId: ID!): RemoveAssetsToPortfolioResult
  }
`

export default portfolioType
