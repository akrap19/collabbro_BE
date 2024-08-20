import { NextFunction, Request, Response } from 'express'
import { ResponseCode } from '../../interface'
import { autoInjectable } from 'tsyringe'
import { ActivityService } from './activityService'

@autoInjectable()
export class ActivityController {
  private readonly activityService: ActivityService

  constructor(activityService: ActivityService) {
    this.activityService = activityService
  }

  getActivities = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user
    const { activities, code } =
      await this.activityService.getActivitiesForUser({ userId: id })
    if (!activities) {
      return next({ code })
    }

    return next({
      data: {
        activities
      },
      code: ResponseCode.OK
    })
  }
}
