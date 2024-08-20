import { NextFunction, Request, Response } from 'express'
import { autoInjectable } from 'tsyringe'
import { ChatService } from './chatService'
import { ResponseCode } from '../../interface'

@autoInjectable()
export class ChatController {
  private readonly chatService: ChatService

  constructor(chatService: ChatService) {
    this.chatService = chatService
  }

  createChat = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user
    const { chatMembersId } = res.locals.input
    const userIds = chatMembersId.push(id)
    const { code } = await this.chatService.createChat({
      userIds
    })

    return next({
      code
    })
  }

  getChatsForUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user
    const { data, code } = await this.chatService.getChatsForUser({
      userId: id
    })

    return next({
      data,
      code
    })
  }

  getChat = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user
    const { chatId } = res.locals.input
    const { chat, code } = await this.chatService.getChatById({
      chatId,
      userId: id
    })

    return next({
      chat,
      code
    })
  }

  markAsUnreadChatForUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.user
    const { chatId } = res.locals.input
    const { code } = await this.chatService.markAsUnreadChatForUser({
      userId: id,
      chatId
    })

    return next({
      code
    })
  }

  deleteChatForUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.user
    const { chatId } = res.locals.input
    const { code } = await this.chatService.deleteChat({ userId: id, chatId })

    return next({
      code
    })
  }
}
