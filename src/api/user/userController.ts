import { NextFunction, Request, Response } from 'express'
import { ResponseCode } from '../../interface'
import { autoInjectable } from 'tsyringe'
import { UserService } from './userService'

@autoInjectable()
export class UserController {
  private readonly userService: UserService

  constructor(userService: UserService) {
    this.userService = userService
  }

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user

    const { user, code } = await this.userService.getUserById({ userId: id })

    if (!user) {
      return next({ code })
    }

    return next({
      data: {
        user
      },
      code: ResponseCode.OK
    })
  }

  finishOnboarding = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.user
    const {
      daw,
      skills,
      professions,
      instruments,
      genres,
      goals,
      profileHandle,
      country,
      language
    } = res.locals.input

    const { code } = await this.userService.finishOnboarding({
      userId: id,
      skills,
      professions,
      instruments,
      daw,
      genres,
      goals,
      profileHandle,
      country,
      language
    })

    return next({
      code
    })
  }

  toogleNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.user

    const { code } = await this.userService.toogleNotifications({ userId: id })

    return next({
      code
    })
  }

  getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = res.locals.input

    const { user, code } = await this.userService.getUserById({ userId: id })

    if (!user) {
      return next({ code })
    }

    return next({
      data: {
        user
      },
      code: ResponseCode.OK
    })
  }
}
