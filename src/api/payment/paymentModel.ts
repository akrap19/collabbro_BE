import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne
} from 'typeorm'
import { Project } from '../project/projectModel'
import { PaymentStatus } from './interface'
import { Collaboration } from '../collaboration/collaborationModel'

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', unique: true })
  authorizationId!: string

  @Column({ type: 'enum', enum: PaymentStatus })
  paymentStatus!: PaymentStatus

  @Column({ type: 'decimal', scale: 2 })
  amount!: number

  @Column({ type: 'varchar', unique: true })
  currencyCode!: string

  @ManyToOne(() => Collaboration, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'collaboration_id' })
  collaboration!: Collaboration

  @Column({ type: 'uuid' })
  collaborationId!: string

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project!: Project

  @Column({ type: 'uuid' })
  projectId!: string

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
    authorizationId: string,
    paymentStatus: PaymentStatus,
    amount: number,
    currencyCode: string,
    projectId: string
  ) {
    this.authorizationId = authorizationId
    this.paymentStatus = paymentStatus
    this.amount = amount
    this.currencyCode = currencyCode
    this.projectId = projectId
  }
}
