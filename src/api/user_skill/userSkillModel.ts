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
import { Skill } from '../skill/skillModel'

@Entity()
@Unique(['userId', 'skillId'])
export class UserSkill {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 20 })
  userId!: string

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: User

  @Column({ type: 'varchar', length: 20 })
  skillId!: string

  @ManyToOne(() => Skill, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'skill_id' })
  skill!: Skill

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

  constructor(userId: string, skillId: string) {
    this.userId = userId
    this.skillId = skillId
  }
}
