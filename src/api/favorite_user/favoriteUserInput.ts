import { Request } from 'express'
import Joi from 'joi'

export const toogleFavoriteUserSchema = (req: Request) => {
  return {
    schema: Joi.object()
      .keys({
        userId: Joi.string()
          .regex(
            /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
          )
          .required()
      })
      .options({ abortEarly: false }),
    input: {
      userId: req.body.userId
    }
  }
}
