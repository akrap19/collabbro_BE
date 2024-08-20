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
import { Skill } from '../skill/skillModel'
import { Project } from '../project/projectModel'
import { SkillLevel } from '../user_skill/interface'

@Entity()
@Unique(['projectId', 'skillId'])
export class ProjectSkill {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'uuid' })
  projectId!: string

  @ManyToOne(() => Project, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'project_id' })
  project!: Project

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

  constructor(projectId: string, skillId: string, skillLevel: SkillLevel) {
    this.projectId = projectId
    this.skillId = skillId
    this.skillLevel = skillLevel
  }
}
