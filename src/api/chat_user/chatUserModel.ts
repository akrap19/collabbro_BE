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
import { User } from '../user/userModel'

@Entity()
export class ChatUser {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  chatId!: string

  @ManyToOne(() => Chat, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'chat_id' })
  chat!: Chat

  @Column({ type: 'varchar', length: 20 })
  userId!: string

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: User

  @Column({ type: 'boolean', default: false })
  deleted!: boolean

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

  constructor(userId: string, chatId: string) {
    this.userId = userId
    this.chatId = chatId
  }
}
