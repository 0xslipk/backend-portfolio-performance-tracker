import { ApolloFastifyContextFunction } from '@as-integrations/fastify'
import { ApolloContext } from './interfaces'
import { User } from './models'
import { PortfolioService, UserService } from './services'

const context =
  (userService: UserService, portfolioService: PortfolioService): ApolloFastifyContextFunction<ApolloContext> =>
  async (request, reply) => ({
    userService,
    portfolioService,
    getAuthorizationToken: async (user: User) => {
      return reply.jwtSign({ id: user.id, username: user.username })
    },
    isAuthorized: async () => {
      try {
        await request.jwtVerify()

        return true
      } catch (error) {
        return false
      }
    },
    getLoggedUserId: async () => {
      return (request.user as { id: number }).id
    },
  })

export default context
