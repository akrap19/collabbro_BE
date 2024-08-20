import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  Unique
} from 'typeorm'
import { User } from '../user/userModel'
import { Instrument } from '../instrument/instrumentModel'

@Entity()
@Unique(['userId', 'instrumentId'])
export class UserInstrument {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'uuid' })
  userId!: string

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: User

  @Column({ type: 'uuid' })
  instrumentId!: string

  @ManyToOne(() => Instrument, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'instrument_id' })
  instrument!: Instrument

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

  constructor(userId: string, instrumentId: string) {
    this.userId = userId
    this.instrumentId = instrumentId
  }
}
