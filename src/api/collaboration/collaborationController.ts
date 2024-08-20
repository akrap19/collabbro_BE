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
    const { projectId, amount, inDeadline, reasonToCollaborate } =
      res.locals.input

    const { code: createCollaborationCode } =
      await this.collaborationService.createCollaboration({
        collaboratorId: id,
        projectId,
        amount,
        inDeadline,
        reasonToCollaborate
      })

    return next({
      code: createCollaborationCode
    })
  }

  updateCollaboration = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id, profileHandle, email } = req.user
    const { collaborationId, collaborationStatus, inDeadline } =
      res.locals.input

    const { code } = await this.collaborationService.updateCollaboration({
      ownerId: id,
      collaborationId,
      collaborationStatus,
      profileHandle: profileHandle ? profileHandle : email,
      inDeadline
    })

    return next({
      code
    })
  }
}
