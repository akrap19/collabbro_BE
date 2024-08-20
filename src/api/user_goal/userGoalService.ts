import { ResponseCode } from '../../interface'
import { ICreateUserGoal, IUserGoalService } from './interface'
import { AppDataSource } from '../../services/typeorm'
import { Repository } from 'typeorm'
import { logger } from '../../logger'
import { getResponseMessage } from '../../services/utils'
import { autoInjectable } from 'tsyringe'
import { UserGoal } from './userGoalModel'

@autoInjectable()
export class UserGoalService implements IUserGoalService {
  private readonly userGoalRepository: Repository<UserGoal>

  constructor() {
    this.userGoalRepository = AppDataSource.manager.getRepository(UserGoal)
  }

  createUserGoal = async ({ userId, goalId, queryRunner }: ICreateUserGoal) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const insertResult = await this.userGoalRepository
        .createQueryBuilder('userGoal', queryRunner)
        .insert()
        .into(UserGoal)
        .values([
          {
            userId,
            goalId
          }
        ])
        .execute()

      if (insertResult.raw.affectedRows !== 1) {
        return { code: ResponseCode.FAILED_INSERT }
      }

      return { userGoalId: insertResult.identifiers[0].id as string, code }
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
}
