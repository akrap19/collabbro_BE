import { NextFunction, Request, Response } from 'express'
import { ResponseCode } from '../../interface'
import { autoInjectable } from 'tsyringe'
import { SkillService } from './skillService'

@autoInjectable()
export class SkillController {
  private readonly skillService: SkillService

  constructor(skillService: SkillService) {
    this.skillService = skillService
  }

  getDefault = async (req: Request, res: Response, next: NextFunction) => {
    const { defaultSkills, code } = await this.skillService.getDefaultSkills()
    if (!defaultSkills) {
      return next({ code })
    }

    return next({
      data: {
        defaultSkills
      },
      code: ResponseCode.OK
    })
  }
}
