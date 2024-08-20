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

// TODO: ADD PARTS FROM FORM IN CHAT DESIGN
@Entity()
@Unique(['ownerId', 'collaboratorId', 'projectId'])
export class Collaboration {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 20 })
  ownerId!: string

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'owner_id' })
  projectOwner!: User

  @Column()
  collaboratorId!: string

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'collaborator_id' })
  collaborator!: User

  @Column({ type: 'varchar', length: 20 })
  projectId!: string

  @ManyToOne(() => Project, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'project_id' })
  project!: Project

  @Column({ type: 'decimal', scale: 2 })
  amount!: number

  @OneToMany(() => Payment, (payment) => payment.collaboration)
  payments!: Payment[]

  @Column({
    type: 'enum',
    enum: CollaborationStatus,
    default: CollaborationStatus.REQUEST_SENT
  })
  collaborationStatus?: CollaborationStatus

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
    amount: number
  ) {
    this.ownerId = ownerId
    this.collaboratorId = collaboratorId
    this.projectId = projectId
    this.amount = amount
  }
}
