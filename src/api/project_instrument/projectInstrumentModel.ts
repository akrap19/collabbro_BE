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
import { Instrument } from '../instrument/instrumentModel'
import { Project } from '../project/projectModel'

@Entity()
@Unique(['projectId', 'instrumentId'])
export class ProjectInstrument {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'uuid' })
  projectId!: string

  @ManyToOne(() => Project, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'project_id' })
  project!: Project

  @Column({ type: 'uuid' })
  instrumentId!: string

  @ManyToOne(() => Instrument, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'instrument_id' })
  instrument!: Instrument

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

  constructor(projectId: string, instrumentId: string) {
    this.projectId = projectId
    this.instrumentId = instrumentId
  }
}
