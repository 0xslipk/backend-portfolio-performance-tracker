export function PortfolioNotFoundError(portfolioId: number) {
  return {
    __typename: 'PortfolioNotFoundError',
    message: 'Unable to find portfolio with associated id.',
    portfolioId,
  }
}

export function PortfolioUnableToCreateError() {
  return {
    __typename: 'PortfolioUnableToCreateError',
    message: 'Unable to create portfolio.',
  }
}

export function PortfolioUnableToUpdateError(portfolioId: number) {
  return {
    __typename: 'PortfolioUnableToUpdateError',
    message: 'Unable to update portfolio.',
    portfolioId,
  }
}

module.exports = {
  PortfolioNotFoundError,
  PortfolioUnableToCreateError,
  PortfolioUnableToUpdateError,
}
