export interface IMessageService {}
import { AsyncResponse, ResponseCode } from '../../interface'

export interface ICreateMessage {
  chatId: string
  content: string
  senderId: string
}

export interface IMarkAsUnread {
  messageId: string
}

export interface IChatUserService {
  createMessage(params: ICreateMessage): AsyncResponse<ResponseCode>
  markAsUnread(params: IMarkAsUnread): AsyncResponse<ResponseCode>
}
