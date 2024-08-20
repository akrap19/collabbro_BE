import { NextFunction, Request, Response } from 'express'
import { ResponseCode } from '../../interface'
import { autoInjectable } from 'tsyringe'
import { GoalService } from './goalService'

@autoInjectable()
export class GoalController {
  private readonly goalService: GoalService

  constructor(goalService: GoalService) {
    this.goalService = goalService
  }

  getDefault = async (req: Request, res: Response, next: NextFunction) => {
    const { defaultGoals, code } = await this.goalService.getDefaultGoals()
    if (!defaultGoals) {
      return next({ code })
    }

    return next({
      data: {
        defaultGoals
      },
      code: ResponseCode.OK
    })
  }
}
