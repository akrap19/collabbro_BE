import WebSocket, { WebSocketServer } from 'ws'
import { IMessageData, IWebSocketEventData } from './interface'
import { autoInjectable, container } from 'tsyringe'
import { MessageService } from '../../api/message/messageService'
import { ChatUserService } from '../../api/chat_user/chatUserService'
import { TokenType, verifyToken } from '../jsonwebtoken'
import { ResponseCode } from '../../interface'

const messageService = container.resolve(MessageService)
const chatUserService = container.resolve(ChatUserService)

@autoInjectable()
export class WebSocketService {
  private websocket: WebSocketServer
  constructor() {
    this.websocket = new WebSocketServer({ noServer: true })
  }

  connect() {
    this.websocket.on('open', (event) => {
      console.log('WebSocket connection opened:', event)
    })

    this.websocket.on('error', (error) => {
      console.error('WebSocket error:', error)
    })

    this.websocket.on('close', (event: any) => {
      console.log('WebSocket connection closed:', event)
    })
  }

  emit(event: string, data: IWebSocketEventData) {
    if (this.websocket) {
      this.websocket.emit(event, data)
    } else if (this.websocket) {
      console.error(`WebSocket is not open. Ready state is: Ready`)
    } else console.error(`Error on websocket initialization`)
  }

  async subscribeToChat(channelId: string) {
    this.websocket.on('connection', (ws: WebSocket) => {
      ws.on(channelId, async (message: string) => {
        const data: IMessageData = JSON.parse(message)
        const { content, bearerToken } = data

        try {
          const decodedToken = await verifyToken<any>(
            bearerToken,
            TokenType.ACCESS_TOKEN
          )

          const { data: inChat, code } =
            await chatUserService.checkIfUserIsInChat({
              senderId: decodedToken.userId,
              chatId: channelId
            })

          if (code !== ResponseCode.OK) {
            ws.send('Error checking if user is in chat')
            return
          }

          if (inChat) {
            await messageService.createMessage({
              chatId: channelId,
              content,
              senderId: decodedToken.userId
            })
            ws.send('Message sent!')
          } else {
            ws.send('You are not part of the chat')
          }
        } catch (error: any) {
          ws.send(`Error processing message: ${error.message}`)
        }
      })
    })
  }

  close() {
    if (this.websocket) {
      this.websocket.close()
    }
  }
}
