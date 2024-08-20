import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn
} from 'typeorm'
import { UserSkill } from '../user_skill/userSkillModel'
import { UserProfession } from '../user_profession/userProfessionModel'
import { Instrument } from '../instrument/instrumentModel'
import { Skill } from '../skill/skillModel'
import { Media } from '../media/mediaModel'
import { User } from '../user/userModel'
import { ProjectStatus, ProjectType } from './interface'
import { Payment } from '../payment/paymentModel'
import { ProjectInstrument } from '../project_instrument/projectInstrumentModel'
import { ProjectSkill } from '../project_skill/projectSkillModel'

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255 })
  name!: string

  @Column({ type: 'enum', enum: ProjectType })
  projectType!: ProjectType

  @Column({ type: 'varchar' })
  description!: string

  @Column({ type: 'varchar' })
  tags!: string

  @Column({ type: 'date' })
  deadline!: string

  @Column({ type: 'boolean' })
  paid!: boolean

  @Column({ type: 'decimal', scale: 2 })
  totalAmount!: number

  @Column({ type: 'varchar' })
  currencyCode!: string

  @Column({ type: 'integer', default: 0 })
  views: number

  @Column({ type: 'uuid' })
  userId!: string

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: User

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.ACTIVE })
  projectStatus?: ProjectStatus

  @OneToMany(() => Media, (media) => media.project)
  mediaFiles?: Media[]

  @OneToMany(() => Payment, (payment) => payment.project)
  payments?: Payment[]

  @OneToMany(
    () => ProjectInstrument,
    (projectInstrument) => projectInstrument.instrument
  )
  projectInstruments?: ProjectInstrument[]

  @OneToMany(() => ProjectSkill, (projectSkill) => projectSkill.skill)
  projectSkills?: UserProfession[]

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
    name: string,
    projectType: ProjectType,
    description: string,
    tags: string,
    deadline: string,
    paid: boolean,
    totalAmount: number,
    currencyCode: string
  ) {
    this.userId = userId
    this.name = name
    this.projectType = projectType
    this.description = description
    this.tags = tags
    this.deadline = deadline
    this.paid = paid
    this.totalAmount = totalAmount
    this.currencyCode = currencyCode
    this.views = 0
  }
}
