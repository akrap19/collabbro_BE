import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToMany
} from 'typeorm'
import { ChatUser } from '../chat_user/chatUserModel'
import { Message } from '../message/messageModel'

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 20 })
  chatId!: string

  @OneToMany(() => Message, (message) => message.chat)
  messages!: Message[]

  @OneToMany(() => ChatUser, (chatUser) => chatUser.user)
  chatUsers?: ChatUser[]

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)'
  })
  createdAt!: Date

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)'
  })
  updatedAt!: Date

  constructor() {}
}
