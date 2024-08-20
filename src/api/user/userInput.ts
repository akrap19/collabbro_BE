import { Request } from 'express'
import Joi from 'joi'
import { SkillLevel } from './interface'

export const finishOnboardingSchema = (req: Request) => {
  return {
    schema: Joi.object()
      .keys({
        profileHandle: Joi.string().required(),
        country: Joi.string().required(),
        language: Joi.string().required(),
        skills: Joi.array().items(
          Joi.object()
            .keys({
              skill: Joi.string().required(),
              skillLevel: Joi.string()
                .valid(...Object.values(SkillLevel))
                .required()
            })
            .optional()
        ),
        professions: Joi.array().items(Joi.string().optional()),
        instruments: Joi.array().items(Joi.string().optional()),
        genres: Joi.array().items(Joi.string().optional()),
        goals: Joi.array().items(Joi.string().optional()),
        daw: Joi.string().optional()
      })
      .required()
      .options({ abortEarly: false }),
    input: {
      skills: req.body.skills,
      professions: req.body.professions,
      instruments: req.body.instruments,
      genres: req.body.genres,
      goals: req.body.goals,
      daw: req.body.daw
    }
  }
}

export const getUserProfileSchema = (req: Request) => {
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
