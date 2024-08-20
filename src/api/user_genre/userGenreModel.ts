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
import { User } from '../user/userModel'
import { Genre } from '../genre/genreModel'

@Entity()
@Unique(['userId', 'genreId'])
export class UserGenre {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 20 })
  userId!: string

  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: User

  @Column({ type: 'varchar', length: 20 })
  genreId!: string

  @ManyToOne(() => Genre, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'genre_id' })
  genre!: Genre

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

  constructor(userId: string, genreId: string) {
    this.userId = userId
    this.genreId = genreId
  }
}
