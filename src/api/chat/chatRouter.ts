import express from 'express'
import { validate } from '../../middleware/validation'
import { container } from 'tsyringe'
import { requireToken } from '../../middleware/auth'
import { ChatController } from './chatController'
import { createChatSchema, deleteChatForUserSchema, getChatSchema, markAsUnreadChatForUserSchema } from './chatInput'

const chatController = container.resolve(ChatController)
export const chatRouter = express.Router()

chatRouter.post(
  '/',
  requireToken,
  validate(createChatSchema),
  chatController.createChat
)

chatRouter.get(
  '/',
  requireToken,
  chatController.getChatsForUser
)

chatRouter.get(
  '/:chatId',
  requireToken,
  validate(getChatSchema),
  chatController.getChat
)

chatRouter.get(
  '/markAsUnread/:chatId',
  requireToken,
  validate(markAsUnreadChatForUserSchema),
  chatController.markAsUnreadChatForUser
)

chatRouter.delete(
  '/:chatId',
  requireToken,
  validate(deleteChatForUserSchema),
  chatController.deleteChatForUser
)