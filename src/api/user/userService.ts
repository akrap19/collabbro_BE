import { ResponseCode } from '../../interface'
import {
  IUserService,
  ICreateUser,
  IGetUserById,
  IGetUserByEmail,
  IFinishOnboarding,
  IToogleNotifications,
  IUpdatePassword,
  IGetUserByEmailAndAuthType
} from './interface'
import { AppDataSource } from '../../services/typeorm'
import { User } from './userModel'
import { Repository } from 'typeorm'
import { logger } from '../../logger'
import { getResponseMessage } from '../../services/utils'
import { autoInjectable, container } from 'tsyringe'
import { SkillService } from '../skill/skillService'
import { ProfessionService } from '../profession/professionService'
import { InstrumentService } from '../instrument/instrumentService'
import { GenreService } from '../genre/genreService'
import { GoalService } from '../goal/goalService'
import { hashString } from '../../services/bcrypt'
import { AuthType } from '../auth/interface'

const skillService = container.resolve(SkillService)
const professionService = container.resolve(ProfessionService)
const instrumentService = container.resolve(InstrumentService)
const genreService = container.resolve(GenreService)
const goalService = container.resolve(GoalService)

@autoInjectable()
export class UserService implements IUserService {
  private readonly userRepository: Repository<User>

  constructor() {
    this.userRepository = AppDataSource.manager.getRepository(User)
  }

  createUser = async ({ email, password, authType }: ICreateUser) => {
    let code: ResponseCode = ResponseCode.OK

    let hashedPassword = null

    if (password) {
      hashedPassword = await hashString(password)
    }

    try {
      const user = await this.userRepository.save({
        email,
        onboardingFlow: false,
        password: hashedPassword,
        authType
      })

      if (!user) {
        return { code: ResponseCode.FAILED_INSERT }
      }

      return { user, code }
    } catch (err: any) {
      code = ResponseCode.SERVER_ERROR
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }

    return { code }
  }

  getUserById = async ({ userId }: IGetUserById) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const user = await this.userRepository.findOne({
        where: {
          id: userId
        }
      })

      if (user === null) {
        return { code: ResponseCode.PROJECT_NOT_FOUND }
      }

      return { user, code }
    } catch (err: any) {
      code = ResponseCode.SERVER_ERROR
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }

    return { code }
  }

  getUserByEmail = async ({ email, queryRunner }: IGetUserByEmail) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const user = await this.userRepository
        .createQueryBuilder('user', queryRunner)
        .where('user.email = :email', { email })
        .getOne()
      if (!user) {
        return { code: ResponseCode.USER_NOT_FOUND }
      }

      return { user, code }
    } catch (err: any) {
      code = ResponseCode.SERVER_ERROR
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }

    return { code }
  }

  getUserByEmailAndAuthType = async ({
    authType,
    email
  }: IGetUserByEmailAndAuthType) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const user = await this.userRepository.findOne({
        where: {
          email,
          authType
        }
      })

      if (user === null) {
        return { code: ResponseCode.USER_NOT_FOUND }
      }

      return { user, code }
    } catch (err: any) {
      code = ResponseCode.SERVER_ERROR
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }

    return { code }
  }

  finishOnboarding = async ({
    userId,
    skills,
    professions,
    instruments,
    daw,
    genres,
    goals,
    profileHandle,
    country,
    language
  }: IFinishOnboarding) => {
    let code: ResponseCode = ResponseCode.OK
    const queryRunner = AppDataSource.createQueryRunner()

    try {
      const user = await this.userRepository.findOne({
        where: {
          id: userId
        }
      })

      if (user === null) {
        return { code: ResponseCode.USER_NOT_FOUND }
      }

      if (user.onboardingFlow === true) {
        return { code: ResponseCode.USER_ALREADY_ONBOARDED }
      }

      await queryRunner.connect()
      await queryRunner.startTransaction()

      const { code: skillCode } = await skillService.handleSkillsOnboarding({
        userId,
        skills,
        queryRunner
      })
      if (skillCode !== ResponseCode.OK) {
        await queryRunner.rollbackTransaction()
        await queryRunner.release()
        return { code: skillCode }
      }
      const { code: professionCode } =
        await professionService.handleProffesionsOnboarding({
          userId,
          professions,
          queryRunner
        })
      if (professionCode !== ResponseCode.OK) {
        await queryRunner.rollbackTransaction()
        await queryRunner.release()
        return { code: professionCode }
      }
      const { code: instrumentCode } =
        await instrumentService.handleInstrumentOnboarding({
          userId,
          instruments,
          queryRunner
        })
      if (instrumentCode !== ResponseCode.OK) {
        await queryRunner.rollbackTransaction()
        await queryRunner.release()
        return { code: instrumentCode }
      }
      const { code: genreCode } = await genreService.handleGenresOnboarding({
        userId,
        genres,
        queryRunner
      })
      if (genreCode !== ResponseCode.OK) {
        await queryRunner.rollbackTransaction()
        await queryRunner.release()
        return { code: genreCode }
      }
      const { code: goalCode } = await goalService.handleGoalsOnboarding({
        userId,
        goals,
        queryRunner
      })
      if (goalCode !== ResponseCode.OK) {
        await queryRunner.rollbackTransaction()
        await queryRunner.release()
        return { code: goalCode }
      }

      await this.userRepository
        .createQueryBuilder('user', queryRunner)
        .update(User)
        .set({
          onboardingFlow: true,
          daw,
          profileHandle,
          country,
          language
        })
        .where('id = :userId', { userId })
        .execute()

      await queryRunner.commitTransaction()
      await queryRunner.release()

      return { code }
    } catch (err: any) {
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      code = ResponseCode.SERVER_ERROR
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }

    return { code }
  }

  toogleNotifications = async ({ userId }: IToogleNotifications) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const user = await this.userRepository.findOne({
        where: {
          id: userId
        }
      })

      if (user === null) {
        return { code: ResponseCode.USER_NOT_FOUND }
      }

      user.notifications = !user.notifications

      const updatedUser = await this.userRepository.save(user)

      if (!updatedUser) {
        code = ResponseCode.FAILED_INSERT
      }

      return { code }
    } catch (err: any) {
      code = ResponseCode.SERVER_ERROR
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }

    return { code }
  }

  async updatePassword({ userId, password }: IUpdatePassword) {
    let code: ResponseCode = ResponseCode.OK

    try {
      const user = await this.userRepository.findOne({
        where: {
          id: userId
        }
      })

      if (user === null) {
        return { code: ResponseCode.USER_NOT_FOUND }
      }

      await this.userRepository.update(userId, {
        password,
        authType: AuthType.PASSWORD
      })

      return { code }
    } catch (e: unknown) {
      code = ResponseCode.SERVER_ERROR
    }
    return { code }
  }
}
