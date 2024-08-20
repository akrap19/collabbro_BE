import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import { UserSkill } from '../user_skill/userSkillModel'

@Entity()
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', unique: true })
  skill: string

  @Column({ type: 'boolean', default: true })
  defaultSkill!: boolean

  @OneToMany(() => UserSkill, (userSkill) => userSkill.user)
  userSkills?: UserSkill[]

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

  constructor(skill: string, defaultSkill: boolean) {
    ;(this.skill = skill), (this.defaultSkill = defaultSkill)
  }
}
