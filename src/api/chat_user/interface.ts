import { AsyncResponse, IServiceMethod, ResponseCode } from '../../interface'
import { Chat } from '../chat/chatModel'

export interface ICreateChatUserEntries extends IServiceMethod {
  userIds: string[]
  chatId: string
}
export interface IGetChatsForUser {
  userId: string
}
export interface IMarkAsUnreadChatUser {
  chatId: string
  userId: string
}
export interface IDeleteChatUser {
  chatId: string
   userId: string
}

export interface ICheckIfUserIsInChat {
  chatId: string
   senderId: string
}

export interface IGetChatsForUserResponse {
  chats: Chat[]
}

export interface IChatUserService {
  createChatUserEntries(
    params: ICreateChatUserEntries
  ): AsyncResponse<ResponseCode>
  getChatsForUser(
    params: IGetChatsForUser
  ): AsyncResponse<IGetChatsForUserResponse>
  markAsUnreadChatUser(
    params: IMarkAsUnreadChatUser
  ): AsyncResponse<ResponseCode>
  deleteChatUser(params: IDeleteChatUser): AsyncResponse<ResponseCode>
  checkIfUserIsInChat(params: ICheckIfUserIsInChat): AsyncResponse<boolean>
}
