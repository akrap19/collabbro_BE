import { ResponseCode } from '../../interface'
import { logger } from '../../logger'
import { getResponseMessage } from '../../services/utils'
import { autoInjectable, container } from 'tsyringe'
import { AppDataSource } from '../../services/typeorm'
import { Goal } from './goalModel'
import { Repository } from 'typeorm'
import {
  ICheckGoal,
  ICreateGoal,
  IGoalService,
  IHandleGoalsOnboarding
} from './interface'
import { UserGoalService } from '../user_goal/userGoalService'

const userGoalService = container.resolve(UserGoalService)

@autoInjectable()
export class GoalService implements IGoalService {
  private readonly goalRepository: Repository<Goal>

  constructor() {
    this.goalRepository = AppDataSource.manager.getRepository(Goal)
  }

  getDefaultGoals = async () => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const defaultGoals = await this.goalRepository.find({
        where: {
          defaultGoal: true
        }
      })

      return { defaultGoals, code }
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

  checkGoal = async ({ goalContent, queryRunner }: ICheckGoal) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const goal = await this.goalRepository
        .createQueryBuilder('goal', queryRunner)
        .where('goal_content = :goalContent', { goalContent })
        .getOne()
      if (!goal) {
        return { code: ResponseCode.GOAL_NOT_FOUND }
      }

      return { goalId: goal.id, code }
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

  createGoal = async ({ goalContent, queryRunner }: ICreateGoal) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const insertResult = await this.goalRepository
        .createQueryBuilder('goal', queryRunner)
        .insert()
        .into(Goal)
        .values([
          {
            goalContent: goalContent,
            defaultGoal: false
          }
        ])
        .execute()

      if (insertResult.raw.affectedRows !== 1) {
        return { code: ResponseCode.FAILED_INSERT }
      }

      return { goalId: insertResult.identifiers[0].id as string, code }
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

  handleGoalsOnboarding = async ({
    userId,
    goals,
    queryRunner
  }: IHandleGoalsOnboarding) => {
    let code: ResponseCode = ResponseCode.OK
    try {
      for (const goalContent of goals) {
        let { goalId, code } = await this.checkGoal({
          goalContent,
          queryRunner
        })

        if (!goalId) {
          const { goalId: newGoalId, code: goalCode } = await this.createGoal({
            goalContent,
            queryRunner
          })

          if (!newGoalId) {
            code = goalCode
            break
          }

          goalId = newGoalId
        }

        const { userGoalId, code: userGoalCode } =
          await userGoalService.createUserGoal({ userId, goalId, queryRunner })

        if (!userGoalId) {
          code = userGoalCode
          break
        }
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
}
