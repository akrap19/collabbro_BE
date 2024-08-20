import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import { User } from '../user/userModel'
import { ActivityType } from './interface'

@Entity()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  userId!: string

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: User

  @Column()
  projectId!: string

  @Column({ type: 'varchar', unique: true })
  activity!: string

  @Column({ type: 'enum', enum: ActivityType })
  activityType!: ActivityType

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

  constructor(
    userId: string,
    projectId: string,
    activity: string,
    activityType: ActivityType
  ) {
    ;(this.userId = userId),
      (this.projectId = projectId),
      (this.activity = activity),
      (this.activityType = activityType)
  }
}
