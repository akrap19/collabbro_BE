import { AsyncResponse, ResponseCode } from '../../interface'
import { Chat } from './chatModel'

export interface ICreateChat {
  userIds: string[]
}

export interface IGetChatsForUser {
  userId: string
}

export interface IGetChatById {
  chatId: string
  userId: string
}

export interface IGetChatsForUserResponse {
  chats: Chat[]
}

export interface IMarkAsUnreadChatForUser {
  chatId: string
  userId: string
}

export interface IDeleteChat {
  chatId: string
  userId: string
}

export interface IChatService {
  createChat(params: ICreateChat): AsyncResponse<ResponseCode>
  getChatById(params: IGetChatById): AsyncResponse<Chat>
  getChatsForUser(
    params: IGetChatsForUser
  ): AsyncResponse<IGetChatsForUserResponse>
  markAsUnreadChatForUser(
    params: IMarkAsUnreadChatForUser
  ): AsyncResponse<ResponseCode>
  deleteChat(params: IDeleteChat): AsyncResponse<ResponseCode>
}
