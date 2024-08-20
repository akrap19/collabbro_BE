import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import { UserInstrument } from '../user_instrument/userInstrumentModel'

@Entity()
export class Instrument {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 20, unique: true })
  instrument: string

  @Column({ type: 'boolean', default: true })
  defaultInstrument!: boolean

  @OneToMany(() => UserInstrument, (userInstrument) => userInstrument.user)
  userInstruments?: UserInstrument[]

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

  constructor(instrument: string, defaultInstrument: boolean) {
    ;(this.instrument = instrument),
      (this.defaultInstrument = defaultInstrument)
  }
}
