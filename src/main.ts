// eslint-disable-next-line import/order
import * as dotenv from 'dotenv'
dotenv.config()

import { ApolloServer } from '@apollo/server'
import fastifyApollo, { fastifyApolloDrainPlugin, fastifyApolloHandler } from '@as-integrations/fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import fastify from 'fastify'
import { LoggerOptions } from 'pino'
import context from './context'
import { ApolloContext, EnvName } from './interfaces'
import resolvers from './resolvers'
import sequelize from './sequelize'
import { UserService, PortfolioService } from './services'
import typeDefs from './type-defs'

const API_BASE_PATH = process.env.API_BASE_PATH || '/api/v1'
const PORT = parseInt(process.env.PORT || '8080')
const NODE_ENV: EnvName = (process.env.NODE_ENV as EnvName) || 'development'
const envToLogger: Record<EnvName, LoggerOptions | boolean> = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
}

const app = fastify({
  logger: envToLogger[NODE_ENV] ?? true,
  disableRequestLogging: true,
})

app.register(cors)
app.register(jwt, {
  secret: process.env.JWT_ACCESS_TOKEN_SECRET || 'secret',
  sign: {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME || '1d',
  },
})

const apollo = new ApolloServer<ApolloContext>({
  typeDefs,
  resolvers,
  nodeEnv: NODE_ENV,
  includeStacktraceInErrorResponses: NODE_ENV !== 'production',
  introspection: NODE_ENV !== 'production',
  plugins: [fastifyApolloDrainPlugin(app)],
})

const start = async () => {
  try {
    const connection = await sequelize()
    const userService = new UserService(connection, app.log)
    const portfolioService = new PortfolioService(connection, app.log)

    await apollo.start()

    app.route({
      url: API_BASE_PATH,
      method: ['GET', 'POST'],
      handler: fastifyApolloHandler(apollo, {
        context: context(userService, portfolioService),
      }),
    })

    app.all('/', (_, reply) => reply.redirect(API_BASE_PATH))

    await app.register(fastifyApollo(apollo))
    await app.listen({ port: PORT, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
