import { ResponseCode } from '../../interface'
import { logger } from '../../logger'
import { getResponseMessage } from '../../services/utils'
import { autoInjectable, container } from 'tsyringe'
import { AppDataSource } from '../../services/typeorm'
import { Chat } from './chatModel'
import { Repository } from 'typeorm'
import { ICreateChat, IChatService, IGetChatById, IGetChatsForUser, IMarkAsUnreadChatForUser } from './interface'
import { ChatUserService } from '../chat_user/chatUserService'
import { WebSocketService } from '../../services/websocket'

const chatUserService = container.resolve(ChatUserService)
const webSocketService = container.resolve(WebSocketService)

@autoInjectable()
export class ChatService implements IChatService {
  private readonly chatRepository: Repository<Chat>

  constructor() {
    this.chatRepository = AppDataSource.manager.getRepository(Chat)
  }

  createChat = async ({ userIds }: ICreateChat) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const queryRunner = AppDataSource.createQueryRunner()

      await queryRunner.connect()
      await queryRunner.startTransaction()

      const insertResult = await this.chatRepository
        .createQueryBuilder('chat', queryRunner)
        .insert()
        .into(Chat)
        .values([])
        .execute()

      if (insertResult.raw.affectedRows !== 1) {
        await queryRunner.rollbackTransaction()
        await queryRunner.release()
        return { code: ResponseCode.FAILED_INSERT }
      }

      const chatId = insertResult.identifiers[0].id

      const { code: chatUserCode } =
        await chatUserService.createChatUserEntries({
          userIds,
          chatId,
          queryRunner
        })
      if (chatUserCode !== ResponseCode.OK) {
        await queryRunner.rollbackTransaction()
        await queryRunner.release()
        return { code: chatUserCode }
      }

      webSocketService.subscribeToChat(chatId)

      await queryRunner.commitTransaction()
      await queryRunner.release()

      return { chatId, code }
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

  getChatById = async ({ chatId, userId }: IGetChatById) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const chat = await this.chatRepository.findOne({
        where: {
          id: chatId,
          chatUsers: {
            userId
          }
        }
      })

      if (chat === null) {
        return { code: ResponseCode.CHAT_NOT_FOUND }
      }

      return { chat, code }
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
      const { data, code: getChatUsersCode} = await chatUserService.getChatsForUser({userId})

      return { data, code: getChatUsersCode }
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

  markAsUnreadChatForUser = async ({ chatId, userId }: IMarkAsUnreadChatForUser) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const {  code: markAsUnreadCode} = await chatUserService.markAsUnreadChatUser({chatId, userId})

      return { code: markAsUnreadCode }
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

  deleteChat = async ({ chatId, userId }: IMarkAsUnreadChatForUser) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const {  code: deleteChatUser} = await chatUserService.deleteChatUser({chatId, userId})

      return { code: deleteChatUser }
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
