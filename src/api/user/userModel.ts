import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import { UserSkill } from '../user_skill/userSkillModel'
import { UserProfession } from '../user_profession/userProfessionModel'
import { UserInstrument } from '../user_instrument/userInstrumentModel'
import { UserGenre } from '../user_genre/userGenreModel'
import { UserGoal } from '../user_goal/userGoalModel'
import { Project } from '../project/projectModel'
import { FavoriteUser } from '../favorite_user/favoriteUserModel'
import { FavoriteProject } from '../favorite_project/favoriteProjectModel'
import { AuthType } from '../auth/interface'
import { Activity } from '../activity/activityModel'
import { ChatUser } from '../chat_user/chatUserModel'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', unique: true, length: 255 })
  email: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  password?: string | null

  @Column({ type: 'enum', enum: AuthType, default: AuthType.PASSWORD })
  authType!: AuthType

  @Column({ type: 'boolean', default: false })
  onboardingFlow!: boolean

  @Column({ type: 'boolean', default: false })
  notifications?: boolean

  @Column({ type: 'varchar', length: 255, nullable: true })
  daw?: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  profileHandle?: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  language?: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  country?: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  profilePictureFileName?: string

  @Column({ type: 'integer', default: 0 })
  storageUsage: number

  @OneToMany(() => Project, (project) => project.user)
  projects?: Project[]

  @OneToMany(() => Activity, (activity) => activity.user)
  activities?: Activity[]

  @OneToMany(() => FavoriteUser, (favoriteUser) => favoriteUser.user)
  FavoriteUsers?: FavoriteUser[]

  @OneToMany(() => FavoriteProject, (favoriteProject) => favoriteProject.user)
  favoriteProjects?: FavoriteProject[]

  @OneToMany(() => UserSkill, (userSkill) => userSkill.skill)
  userSkills?: UserSkill[]

  @OneToMany(() => ChatUser, (chatUser) => chatUser.chat)
  chatUsers?: ChatUser[]

  @OneToMany(
    () => UserProfession,
    (userProfession) => userProfession.profession
  )
  userProfessions?: UserProfession[]

  @OneToMany(
    () => UserInstrument,
    (userInstrument) => userInstrument.instrument
  )
  userInstruments?: UserInstrument[]

  @OneToMany(() => UserGenre, (userGenre) => userGenre.genre)
  userGenres?: UserGenre[]

  @OneToMany(() => UserGoal, (userGoal) => userGoal.goal)
  userGoals?: UserGoal[]

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
    email: string,
    onboardingFlow: boolean,
    authType: AuthType,
    profilePictureFileName?: string,
    password?: string
  ) {
    this.email = email
    this.onboardingFlow = onboardingFlow
    this.authType = authType
    this.profilePictureFileName = profilePictureFileName
    this.storageUsage = 0
    this.password = password
  }
}
