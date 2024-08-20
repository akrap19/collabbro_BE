import { NextFunction, Request, Response } from 'express'
import { ResponseCode } from '../../interface'
import { autoInjectable } from 'tsyringe'
import { FavoriteProjectService } from './favoriteProjectService'

@autoInjectable()
export class FavoriteProjectController {
  private readonly favoriteProjectService: FavoriteProjectService

  constructor(favoriteProjectService: FavoriteProjectService) {
    this.favoriteProjectService = favoriteProjectService
  }

  toogleFavoriteProject = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.user
    const { projectId } = res.locals.input
    const { code } = await this.favoriteProjectService.toogleFavoriteProject({
      projectId,
      userId: id
    })

    return next({ code })
  }

  getFavoriteProjectsForUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.user
    const { favoriteProjects, code } =
      await this.favoriteProjectService.getFavoriteProjectsForUser({
        userId: id
      })
    if (!favoriteProjects) {
      return next({ code })
    }

    return next({
      data: {
        favoriteProjects
      },
      code: ResponseCode.OK
    })
  }
}
