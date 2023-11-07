import { mergeTypeDefs } from '@graphql-tools/merge'
import commonTypes from './common'
import pingType from './ping'
import portfolioType from './portfolio'
import userType from './user'

const typeDefs = mergeTypeDefs([pingType, commonTypes, userType, portfolioType])

export default typeDefs
