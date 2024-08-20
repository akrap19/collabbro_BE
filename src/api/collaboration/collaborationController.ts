import { NextFunction, Request, Response } from 'express'
import { ResponseCode } from '../../interface'
import { autoInjectable } from 'tsyringe'
import { CollaborationService } from './collaborationService'

@autoInjectable()
export class CollaborationController {
  private readonly collaborationService: CollaborationService

  constructor(collaborationService: CollaborationService) {
    this.collaborationService = collaborationService
  }

  createCollaboration = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.user
    const { projectId, amount } = res.locals.input

    const { newCollaboration: collaboration, code } =
      await this.collaborationService.createCollaboration({
        collaboratorId: id,
        projectId,
        amount
      })
    if (!collaboration) {
      return next({ code })
    }

    return next({
      data: {
        collaboration
      },
      code: ResponseCode.OK
    })
  }

  updateCollaboration = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id, profileHandle, email } = req.user
    const { collaborationId, collaborationStatus } = res.locals.input

    const { code } = await this.collaborationService.updateCollaboration({
      ownerId: id,
      collaborationId,
      collaborationStatus,
      profileHandle: profileHandle ? profileHandle : email
    })

    return next({
      code
    })
  }
}
