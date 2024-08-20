import express from 'express'
import { validate } from '../../middleware/validation'
import { container } from 'tsyringe'
import { requireToken } from '../../middleware/auth'
import { CollaborationController } from './collaborationController'
import {
  createCollaborationSchema,
  updateCollaborationSchema
} from './collaborationInput'

const collaborationController = container.resolve(CollaborationController)
export const collaborationRouter = express.Router()

collaborationRouter.post(
  '/',
  requireToken,
  validate(createCollaborationSchema),
  collaborationController.createCollaboration
)
collaborationRouter.put(
  '/:collaborationId',
  requireToken,
  validate(updateCollaborationSchema),
  collaborationController.updateCollaboration
)
