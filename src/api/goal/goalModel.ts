import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import { UserGoal } from '../user_goal/userGoalModel'

@Entity()
export class Goal {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 20, unique: true })
  goalContent: string

  @Column({ type: 'boolean', default: true })
  defaultGoal!: boolean

  @OneToMany(() => UserGoal, (userGoal) => userGoal.user)
  userGoals?: UserGoal[]

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

  constructor(goalContent: string, defaultGoal: boolean) {
    ;(this.goalContent = goalContent), (this.defaultGoal = defaultGoal)
  }
}
