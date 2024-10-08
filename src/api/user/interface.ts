import { AsyncResponse, IServiceMethod, ResponseCode } from '../../interface'
import { AuthType } from '../auth/interface'
import { User } from './userModel'

export enum SkillLevel {
  BEGINNER = 'Begginer',
  INTERMEDIATE = 'Seeking help',
  ADVANCED = 'Advanced'
}

export interface ICreateUser extends IServiceMethod {
  email: string
  password?: string
  authType: AuthType
}

export interface IGetUserById {
  userId: string
}

export interface IGetUserByEmail extends IServiceMethod {
  email: string
  allUsers?: boolean
}

export interface IGetUserByEmailAndAuthType {
  email: string
  authType: AuthType
}

export interface UserSkill {
  userId: string
  skillName: string
  skillLevel: SkillLevel
}

export interface IFinishOnboarding {
  userId: string
  skills: UserSkill[]
  professions: string[]
  instruments: string[]
  daw: string
  genres: string[]
  goals: string[]
  profileHandle: string
  country: string
  language: string
}

export interface IToogleNotifications {
  userId: string
}

export interface IUpdatePassword {
  userId: string
  password: string
}

export interface IUserService {
  createUser(params: ICreateUser): AsyncResponse<User>
  getUserById(params: IGetUserById): AsyncResponse<User>
  getUserByEmail(params: IGetUserByEmail): AsyncResponse<User>
  getUserByEmailAndAuthType(
    params: IGetUserByEmailAndAuthType
  ): AsyncResponse<User>
  finishOnboarding(params: IFinishOnboarding): AsyncResponse<ResponseCode>
  toogleNotifications(params: IToogleNotifications): AsyncResponse<ResponseCode>
  updatePassword(params: IUpdatePassword): AsyncResponse<ResponseCode>
}
