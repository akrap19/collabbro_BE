import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import { UserGenre } from '../user_genre/userGenreModel'

@Entity()
export class Genre {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', unique: true })
  genre: string

  @Column({ type: 'boolean', default: true })
  defaultGenre!: boolean

  @OneToMany(() => UserGenre, (userGenre) => userGenre.user)
  userGenres?: UserGenre[]

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

  constructor(genre: string, defaultGenre: boolean) {
    ;(this.genre = genre), (this.defaultGenre = defaultGenre)
  }
}
