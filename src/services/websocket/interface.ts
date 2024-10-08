import { IDeleteNotificationEvent } from '../../api/notification/interface'

// Add other data interfcaes if needed (or)
export type IWebSocketEventData = IDeleteNotificationEvent

export interface IMessageData {
  content: string
  bearerToken: string
}
