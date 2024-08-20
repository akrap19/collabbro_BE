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
import { SkillLevel } from './interface'

@Entity()
@Unique(['userId', 'skillId'])
export class UserSkill {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'uuid' })
  userId!: string

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: User

  @Column({ type: 'uuid' })
  skillId!: string

  @ManyToOne(() => Skill, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'skill_id' })
  skill!: Skill

  @Column({ type: 'enum', enum: SkillLevel })
  skillLevel!: SkillLevel

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

  constructor(userId: string, skillId: string, skillLevel: SkillLevel) {
    this.skillLevel = skillLevel
    this.userId = userId
    this.skillId = skillId
  }
}
