import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import { UserProfession } from '../user_profession/userProfessionModel'

@Entity()
export class Profession {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', unique: true })
  profession: string

  @Column({ type: 'boolean', default: true })
  defaultProfession!: boolean

  @OneToMany(() => UserProfession, (userProfession) => userProfession.user)
  userProfessions?: UserProfession[]

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

  constructor(profession: string, defaultProfession: boolean) {
    ;(this.profession = profession),
      (this.defaultProfession = defaultProfession)
  }
}
