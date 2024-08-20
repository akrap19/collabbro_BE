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

@Entity()
@Unique(['projectId', 'skillId'])
export class ProjectSkill {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 20 })
  projectId!: string

  @ManyToOne(() => Project, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'project_id' })
  project!: Project

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

  constructor(projectId: string, skillId: string) {
    this.projectId = projectId
    this.skillId = skillId
  }
}
