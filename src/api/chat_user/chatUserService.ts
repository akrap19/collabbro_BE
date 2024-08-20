import { ResponseCode } from '../../interface'
import { logger } from '../../logger'
import { getResponseMessage } from '../../services/utils'
import { autoInjectable, container } from 'tsyringe'
import { AppDataSource } from '../../services/typeorm'
import { Repository } from 'typeorm'
import {
  IChatUserService,
  ICheckIfUserIsInChat,
  ICreateChatUserEntries,
  IDeleteChatUser,
  IGetChatsForUser,
  IMarkAsUnreadChatUser
} from './interface'
import { ChatUser } from './chatUserModel'
import { MessageService } from '../message/messageService'

const messageService = container.resolve(MessageService)

@autoInjectable()
export class ChatUserService implements IChatUserService {
  private readonly chatUserRepository: Repository<ChatUser>

  constructor() {
    this.chatUserRepository = AppDataSource.manager.getRepository(ChatUser)
  }

  createChatUserEntries = async ({
    userIds,
    chatId,
    queryRunner
  }: ICreateChatUserEntries) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      for (const userId of userIds) {
        const insertResult = await this.chatUserRepository
          .createQueryBuilder('chatUser', queryRunner)
          .insert()
          .into(ChatUser)
          .values({ userId, chatId })
          .execute()

        if (insertResult.raw.affectedRows !== 1) {
          code = ResponseCode.FAILED_INSERT
          break
        }
      }

      return { code }
    } catch (err: any) {
      code = ResponseCode.SERVER_ERROR
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }

    return { code }
  }

  getChatsForUser = async ({ userId }: IGetChatsForUser) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const chatUsers = await this.chatUserRepository.find({
        where: {
          userId
        }
      })

      const chats = chatUsers.map((chatUser) => {
        return chatUser.chat
      })

      return { data: { chats }, code }
    } catch (err: any) {
      code = ResponseCode.SERVER_ERROR
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }

    return { code }
  }

  markAsUnreadChatUser = async ({ chatId, userId }: IMarkAsUnreadChatUser) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const chatUser = await this.chatUserRepository.findOne({
        where: {
          chatId,
          userId
        }
      })

      if (chatUser === null) {
        return { code: ResponseCode.CHAT_NOT_FOUND }
      }

      const { messages } = chatUser.chat
      if (messages && messages.length) {
        return { code: ResponseCode.NO_MESSAGES_IN_CHAT }
      }

      const lastMessage = chatUser.chat.messages.pop()

      if (lastMessage) {
        await messageService.markAsUnread({ messageId: lastMessage.id })
      }

      return { code }
    } catch (err: any) {
      code = ResponseCode.SERVER_ERROR
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }

    return { code }
  }

  deleteChatUser = async ({ chatId, userId }: IDeleteChatUser) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const chatUser = await this.chatUserRepository.findOne({
        where: {
          userId, chatId
        }
      })

      if (chatUser === null) {
        return { code: ResponseCode.CHAT_NOT_FOUND }
      }

      await this.chatUserRepository.delete({ id: chatUser.id })

      return { code }
    } catch (err: any) {
      code = ResponseCode.SERVER_ERROR
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }

    return { code }
  }

  checkIfUserIsInChat = async ({ chatId, senderId }: ICheckIfUserIsInChat) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const chatUser = await this.chatUserRepository.findOne({
        where: {
          userId: senderId, chatId
        }
      })

      if (chatUser === null) {
        return { data: false, code: ResponseCode.CHAT_NOT_FOUND }
      }

      return { data: true, code }
    } catch (err: any) {
      code = ResponseCode.SERVER_ERROR
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }

    return { code }
  }
}
