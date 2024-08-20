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
import { Profession } from '../profession/professionModel'

@Entity()
@Unique(['userId', 'professionId'])
export class UserProfession {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'uuid' })
  userId!: string

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: User

  @Column({ type: 'uuid' })
  professionId!: string

  @ManyToOne(() => Profession, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'profession_id' })
  profession!: Profession

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

  constructor(userId: string, professionId: string) {
    this.userId = userId
    this.professionId = professionId
  }
}
