import { mergeResolvers } from '@graphql-tools/merge'
import ping from './ping'
import portfolio from './portfolio'
import user from './user'

export default mergeResolvers([ping, user, portfolio])
