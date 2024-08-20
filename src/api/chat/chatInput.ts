import { Request } from 'express'
import Joi from 'joi'

export const createChatSchema = (req: Request) => {
  return {
    schema: Joi.object()
      .keys({
        chatMembersId: Joi.array()
          .items(
            Joi.string()
              .regex(
                /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
              )
              .required()
          )
          .required()
      })
      .options({ abortEarly: false }),
    input: {
      chatMembersId: req.body.chatMembersId
    }
  }
}

export const getChatSchema = (req: Request) => {
  return {
    schema: Joi.object()
      .keys({
        chatId: Joi.string()
          .regex(
            /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
          )
          .required()
      })
      .options({ abortEarly: false }),
    input: {
      chatId: req.params.chatId
    }
  }
}

export const markAsUnreadChatForUserSchema = (req: Request) => {
  return {
    schema: Joi.object()
      .keys({
        chatId: Joi.string()
          .regex(
            /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
          )
          .required()
      })
      .options({ abortEarly: false }),
    input: {
      chatId: req.params.chatId
    }
  }
}

export const deleteChatForUserSchema = (req: Request) => {
  return {
    schema: Joi.object()
      .keys({
        chatId: Joi.string()
          .regex(
            /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
          )
          .required()
      })
      .options({ abortEarly: false }),
    input: {
      chatId: req.params.chatId
    }
  }
}
