import { ResponseCode } from '../../interface'
import { logger } from '../../logger'
import { getResponseMessage } from '../../services/utils'
import { autoInjectable, container, delay, inject } from 'tsyringe'
import { AppDataSource } from '../../services/typeorm'
import { Activity } from './activityModel'
import { Repository } from 'typeorm'
import { ProjectService } from '../project/projectService'
import {
  IActivityService,
  ActivityType,
  ICreateActivity,
  IGetActivitiesForUser
} from './interface'

@autoInjectable()
export class ActivityService implements IActivityService {
  private readonly activityRepository: Repository<Activity>

  constructor(
    @inject(delay(() => ProjectService)) public projectService: ProjectService
  ) {
    this.activityRepository = AppDataSource.manager.getRepository(Activity)
  }

  getActivitiesForUser = async ({ userId }: IGetActivitiesForUser) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const activities = await this.activityRepository.find({
        where: {
          userId
        }
      })

      return { activities, code }
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

  createActivity = async ({
    userId,
    profileHandle,
    projectId,
    activityType,
    queryRunner
  }: ICreateActivity) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const { project, code: projectCode } =
        await this.projectService.getProjectById({ projectId })

      if (!project) {
        return { code: projectCode }
      }

      let message = ''
      switch (activityType) {
        case ActivityType.COLLABORATION_END:
          message = `${profileHandle} helped on project ${project.name}`
        case ActivityType.CREATE_PROJECT:
          message = `${profileHandle} created project ${project.name}`
        default:
          message = ''
      }

      const insertResult = await this.activityRepository
        .createQueryBuilder('activity', queryRunner)
        .insert()
        .into(Activity)
        .values([
          {
            userId,
            projectId,
            activityType,
            activity: message
          }
        ])
        .execute()

      if (insertResult.raw.affectedRows !== 1) {
        return { code: ResponseCode.FAILED_INSERT }
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
