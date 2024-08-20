import { Request } from 'express'
import Joi from 'joi'
import { SkillLevel } from '../user_skill/interface'

export const createProjectSchema = (req: Request) => {
  return {
    schema: Joi.object()
      .keys({
        name: Joi.string().required(),
        projectType: Joi.string()
          .valid('Collaboration', 'Seeking help')
          .required(),
        description: Joi.string().required(),
        paid: Joi.boolean().required(),
        totalAmount: Joi.number().required(),
        currencyCode: Joi.string().required(),
        deadline: Joi.date().required(),
        tags: Joi.string().required(),
        instrumentIds: Joi.array()
          .items(
            Joi.string()
              .regex(
                /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
              )
              .required()
          )
          .required(),
        skills: Joi.array()
          .items(
            Joi.object().keys({
              id: Joi.string()
                .regex(
                  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
                )
                .required(),
              level: Joi.string()
                .valid(...Object.values(SkillLevel))
                .required()
            })
          )
          .required(),
        mediaFiles: Joi.array()
          .items({
            mediaType: Joi.string().required(),
            mediaFileName: Joi.string().required()
          })
          .required()
      })
      .options({ abortEarly: false }),
    input: {
      name: req.body.name,
      projectType: req.body.projectType,
      description: req.body.description,
      paid: req.body.paid,
      totalAmount: req.body.totalAmount,
      currencyCode: req.body.currencyCode,
      deadline: req.body.deadline,
      tags: req.body.tags,
      instrumentIds: req.body.instrumentIds,
      skills: req.body.skills,
      mediaFiles: req.body.mediaFiles
    }
  }
}

export const getProjectsSchema = (req: Request) => {
  return {
    schema: Joi.object()
      .keys({
        type: Joi.string().valid('Collaboration', 'Seeking help').optional(),
        genre: Joi.string().optional(),
        country: Joi.string().optional(),
        skill: Joi.string().optional(),
        instrument: Joi.string().optional(),
        profession: Joi.string().optional(),
        page: Joi.number().required(),
        perPage: Joi.number().required()
      })
      .options({ abortEarly: false }),
    input: {
      type: req.query.type,
      genre: req.query.genre,
      country: req.query.country,
      skill: req.query.skills,
      instrument: req.query.instrument,
      profession: req.query.profession,
      page: req.query.page,
      perPage: req.query.perPage
    }
  }
}

export const getProjectByIdSchema = (req: Request) => {
  return {
    schema: Joi.object()
      .keys({
        id: Joi.string()
          .regex(
            /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
          )
          .required()
      })
      .options({ abortEarly: false }),
    input: {
      id: req.params.id
    }
  }
}
