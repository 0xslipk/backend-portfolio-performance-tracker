import { AuthError, UserUnableToCreateError } from '../errors'
import { ApolloContext, CreateUserArgs, LoginArgs } from '../interfaces'

export default {
  Mutation: {
    login: async (_parent: undefined, args: LoginArgs, context: ApolloContext) => {
      const user = await context.userService.login(args.username, args.password)

      if (!user) {
        return AuthError(args.username)
      }

      const token = await context.getAuthorizationToken(user)

      return {
        __typename: 'AuthSuccess',
        token,
      }
    },
    async createUser(_parent: undefined, args: CreateUserArgs, context: ApolloContext) {
      const user = await context.userService.createUser(args.username, args.password)

      if (!user) {
        return UserUnableToCreateError()
      }

      return {
        __typename: 'User',
        id: user.id,
        username: user.username,
      }
    },
  },
}
