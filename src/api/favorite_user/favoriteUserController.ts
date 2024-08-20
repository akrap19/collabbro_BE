import { NextFunction, Request, Response } from 'express'
import { ResponseCode } from '../../interface'
import { autoInjectable } from 'tsyringe'
import { FavoriteUserService } from './favoriteUserService'

@autoInjectable()
export class FavoriteUserController {
  private readonly favoriteUserService: FavoriteUserService

  constructor(favoriteUserService: FavoriteUserService) {
    this.favoriteUserService = favoriteUserService
  }

  toogleFavoriteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.user
    const { userId } = res.locals.input
    const { code } = await this.favoriteUserService.toogleFavoriteUser({
      userId,
      ownerId: id
    })

    return next({ code })
  }

  getFavoritesForUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.user
    const { favoriteUsers, code } =
      await this.favoriteUserService.getFavoriteUsersForUser({ userId: id })
    if (!favoriteUsers) {
      return next({ code })
    }

    return next({
      data: {
        favoriteUsers
      },
      code: ResponseCode.OK
    })
  }
}
