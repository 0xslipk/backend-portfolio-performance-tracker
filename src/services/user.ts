import { compare } from 'bcrypt'
import { BaseLogger as PinoLogger } from 'pino'
import { Repository, Sequelize } from 'sequelize-typescript'
import { User } from '../models'

export class UserService {
  private readonly logger: PinoLogger
  private readonly userModel: Repository<User>

  constructor(connection: Sequelize, logger: PinoLogger) {
    this.logger = logger
    this.userModel = connection.getRepository(User)
  }

  public async login(username: string, password: string): Promise<User | null> {
    try {
      const user = await this.userModel.findOne<User>({
        where: { username },
      })

      if (user) {
        const isValid = await compare(password, user.password)

        if (isValid) {
          return user
        }
      }

      return null
    } catch (err) {
      this.logger.error({ err }, 'Error trying to login')

      return null
    }
  }

  public async createUser(username: string, password: string): Promise<User | null> {
    try {
      const user = await this.userModel.findOne<User>({
        where: { username },
      })

      if (user) {
        throw new Error('User already exists')
      }

      return this.userModel.create({
        username,
        password,
      })
    } catch (err) {
      this.logger.error({ err }, 'Error trying to create a new User')

      return null
    }
  }
}
