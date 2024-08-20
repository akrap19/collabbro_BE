import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  Unique,
  OneToMany
} from 'typeorm'
import { User } from '../user/userModel'
import { Project } from '../project/projectModel'
import { CollaborationStatus } from './interface'
import { Payment } from '../payment/paymentModel'

@Entity()
@Unique(['ownerId', 'collaboratorId', 'projectId'])
export class Collaboration {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'uuid' })
  ownerId!: string

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'owner_id' })
  projectOwner!: User

  @Column({ type: 'uuid' })
  collaboratorId!: string

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'collaborator_id' })
  collaborator!: User

  @Column({ type: 'uuid' })
  projectId!: string

  @ManyToOne(() => Project, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'project_id' })
  project!: Project

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number

  @OneToMany(() => Payment, (payment) => payment.collaboration)
  payments!: Payment[]

  @Column({
    type: 'enum',
    enum: CollaborationStatus,
    default: CollaborationStatus.REQUEST_SENT
  })
  collaborationStatus?: CollaborationStatus

  @Column({ type: 'varchar' })
  reasonToCollaborate!: string

  @Column({ type: 'boolean', nullable: true })
  inDeadline?: boolean

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
    ownerId: string,
    collaboratorId: string,
    projectId: string,
    reasonToCollaborate: string,
    amount: number,
    inDeadline?: boolean
  ) {
    this.ownerId = ownerId
    this.collaboratorId = collaboratorId
    this.projectId = projectId
    this.amount = amount
    this.reasonToCollaborate = reasonToCollaborate
    this.inDeadline = inDeadline
  }
}
