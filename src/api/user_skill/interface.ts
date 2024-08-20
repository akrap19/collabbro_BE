import { AsyncResponse, IServiceMethod } from '../../interface'

export enum SkillLevel {
  BEGINNER = 'Begginer',
  INTERMEDIATE = 'Seeking help',
  ADVANCED = 'Advanced'
}

export interface ICreateUserSkill extends IServiceMethod {
  userId: string
  skillId: string
  skillLevel: SkillLevel
}

export interface IUserSkillService {
  createUserSkill(params: ICreateUserSkill): AsyncResponse<string>
}
