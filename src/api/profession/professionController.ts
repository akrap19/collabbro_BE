import { NextFunction, Request, Response } from 'express'
import { ResponseCode } from '../../interface'
import { autoInjectable } from 'tsyringe'
import { ProfessionService } from './professionService'

@autoInjectable()
export class ProfessionController {
  private readonly professionService: ProfessionService

  constructor(professionService: ProfessionService) {
    this.professionService = professionService
  }

  getDefault = async (req: Request, res: Response, next: NextFunction) => {
    const { defaultProfessions, code } =
      await this.professionService.getDefaultProfessions()
    if (!defaultProfessions) {
      return next({ code })
    }

    return next({
      data: {
        defaultProfessions
      },
      code: ResponseCode.OK
    })
  }
}
