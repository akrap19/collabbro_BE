import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  JoinColumn,
  ManyToOne
} from 'typeorm'
import { Chat } from '../chat/chatModel'

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 20 })
  senderId!: string

  @Column({ type: 'varchar' })
  content!: string

  @ManyToOne(() => Chat, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chat_id' })
  chat!: Chat

  @Column({ type: 'varchar', length: 20 })
  chatId!: string

  @Column({ type: 'boolean', default: false })
  read!: boolean

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

  constructor(chatId: string, content: string, senderId: string) {
    ;(this.chatId = chatId),
      (this.senderId = senderId),
      (this.content = content)
    this.read = false
  }
}
