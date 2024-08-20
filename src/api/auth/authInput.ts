import { Request } from 'express'
import Joi from 'joi'
import { AuthType } from './interface'

export const loginSchema = (req: Request) => {
  return {
    schema: Joi.object()
      .keys({
        authType: Joi.string()
          .valid(...Object.values(AuthType))
          .required(),
        email: Joi.string().email().when('authType', {
          is: AuthType.PASSWORD,
          then: Joi.string().email().required()
        }),
        password: Joi.string().when('authType', {
          is: AuthType.PASSWORD,
          then: Joi.string().required()
        }),
        token: Joi.string().when('authType', {
          is: AuthType.GOOGLE,
          then: Joi.string().required()
        })
      })
      .options({ abortEarly: false }),
    input: {
      authType: req.body.authType,
      email: req.body.email,
      token: req.body.token,
      password: req.body.password
    }
  }
}

export const registerSchema = (req: Request) => {
  return {
    schema: Joi.object()
      .keys({
        authType: Joi.string()
          .valid(...Object.values(AuthType))
          .required(),
        email: Joi.string().email().when('authType', {
          is: AuthType.PASSWORD,
          then: Joi.string().email().required()
        }),
        password: Joi.string().when('authType', {
          is: AuthType.PASSWORD,
          then: Joi.string().required()
        }),
        token: Joi.string().when('authType', {
          is: AuthType.GOOGLE,
          then: Joi.string().required()
        })
      })
      .options({ abortEarly: false }),
    input: {
      authType: req.body.authType,
      email: req.body.email,
      token: req.body.token,
      password: req.body.password
    }
  }
}

export const forgotPasswordSchema = (req: Request) => {
  return {
    schema: Joi.object()
      .keys({
        email: Joi.string().required()
      })
      .options({ abortEarly: false }),
    input: {
      email: req.body.email
    }
  }
}

export const resetPasswordSchema = (req: Request) => {
  return {
    schema: Joi.object()
      .keys({
        uid: Joi.string()
          .regex(
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
          )
          .required(),
        password: Joi.string()
          .min(8)
          .max(24)
          // .regex(new RegExp(atob(config.PASSWORD_BASE64_REGEX)))
          .required()
      })
      .options({ abortEarly: false }),
    input: {
      uid: req.body.uid,
      password: req.body.password
    }
  }
}
