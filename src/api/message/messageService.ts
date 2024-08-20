import { ResponseCode } from '../../interface'
import { logger } from '../../logger'
import { getResponseMessage } from '../../services/utils'
import { autoInjectable } from 'tsyringe'
import { AppDataSource } from '../../services/typeorm'
import { Repository } from 'typeorm'
import { ICreateMessage, IMarkAsUnread, IMessageService } from './interface'
import { Message } from './messageModel'

@autoInjectable()
export class MessageService implements IMessageService {
  private readonly messageRepository: Repository<Message>

  constructor() {
    this.messageRepository = AppDataSource.manager.getRepository(Message)
  }

  createMessage = async ({ chatId, content, senderId }: ICreateMessage) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const newMessage = await this.messageRepository.save({
        chatId,
        content,
        senderId
      })

      if (!newMessage) {
        return { code: ResponseCode.FAILED_INSERT }
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
  markAsUnread = async ({ messageId }: IMarkAsUnread) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const message = await this.messageRepository.findOne({
        where: {
          id: messageId
        }
      })

      if (!message) {
        return { code: ResponseCode.MESSAGE_NOT_EXIST }
      }

      message.read = false

      await this.messageRepository.save(message)

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
}
