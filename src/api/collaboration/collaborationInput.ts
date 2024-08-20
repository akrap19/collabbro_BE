import { Request } from 'express'
import Joi from 'joi'

export const createCollaborationSchema = (req: Request) => {
  return {
    schema: Joi.object()
      .keys({
        projectId: Joi.string()
          .regex(
            /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
          )
          .required(),
        amount: Joi.number().required(),
        reasonToCollaborate: Joi.string().required(),
        inDeadline: Joi.boolean().optional()
      })
      .options({ abortEarly: false }),
    input: {
      projectId: req.body.projectId,
      amount: req.body.amount,
      reasonToCollaborate: req.body.reasonToCollaborate,
      inDeadline: req.body.inDeadline
    }
  }
}

export const sendCollaborationResponseSchema = (req: Request) => {
  return {
    schema: Joi.object()
      .keys({
        collaborationId: Joi.string()
          .regex(
            /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
          )
          .required(),
        collaborationStatus: Joi.string()
          .valid('Request approved', 'Request declined')
          .required(),
        inDeadline: Joi.boolean().optional()
      })
      .options({ abortEarly: false }),
    input: {
      collaborationId: req.params.collaborationId,
      collaborationStatus: req.body.collaborationStatus,
      inDeadline: req.body.inDeadline
    }
  }
}

export const updateCollaborationSchema = (req: Request) => {
  return {
    schema: Joi.object()
      .keys({
        collaborationId: Joi.string()
          .regex(
            /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
          )
          .required(),
        collaborationStatus: Joi.string()
          .valid('Request approved', 'Request declined')
          .required()
      })
      .options({ abortEarly: false }),
    input: {
      collaborationId: req.params.collaborationId,
      collaborationStatus: req.body.collaborationStatus
    }
  }
}
