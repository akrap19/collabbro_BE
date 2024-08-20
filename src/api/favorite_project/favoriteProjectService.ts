import { ResponseCode } from '../../interface'
import { logger } from '../../logger'
import { getResponseMessage } from '../../services/utils'
import { autoInjectable, container } from 'tsyringe'
import { AppDataSource } from '../../services/typeorm'
import { Repository } from 'typeorm'
import {
  IFavoriteProjectService,
  IGetFavoriteProjectsForUser,
  IToogleFavoriteProject
} from './interface'
import { FavoriteProject } from './favoriteProjectModel'
import { NotificationService } from '../notification/notificationService'
import { NotificationType } from '../notification/interface'

const notificationService = container.resolve(NotificationService)

@autoInjectable()
export class FavoriteProjectService implements IFavoriteProjectService {
  private readonly favoriteProjectRepository: Repository<FavoriteProject>

  constructor() {
    this.favoriteProjectRepository =
      AppDataSource.manager.getRepository(FavoriteProject)
  }

  getFavoriteProjectsForUser = async ({
    userId
  }: IGetFavoriteProjectsForUser) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const favoriteProjects = await this.favoriteProjectRepository.find({
        where: {
          userId
        }
      })

      return { favoriteProjects, code }
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

  toogleFavoriteProject = async ({
    userId,
    projectId
  }: IToogleFavoriteProject) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const favoriteProject = await this.favoriteProjectRepository.findOne({
        where: {
          userId,
          projectId
        }
      })

      if (favoriteProject === null) {
        const newFavoriteProject = await this.favoriteProjectRepository.save({
          userId,
          projectId
        })

        if (!newFavoriteProject.id) {
          return { code: ResponseCode.FAILED_INSERT }
        }

        const notificationMessage = `${newFavoriteProject.user.email} favorited your project.`

        await notificationService.createNotification({
          message: notificationMessage,
          receiverId: newFavoriteProject.project.userId,
          type: NotificationType.ADDED_TO_FAVORITES,
          senderId: userId
        })

        return { code }
      }

      await this.favoriteProjectRepository.remove(favoriteProject)

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
