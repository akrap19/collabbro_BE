import { AsyncResponse, IServiceMethod, ResponseCode } from '../../interface'
import { Skill } from './skillModel'

export interface ISkillData {
  skillName: string
  skillLevel: SkillLevel
}

export enum SkillLevel {
  BEGINNER = 'Begginer',
  INTERMEDIATE = 'Seeking help',
  ADVANCED = 'Advanced'
}

export interface ICheckSkill extends IServiceMethod {
  skillName: string
}

export interface ICreateSkill extends IServiceMethod {
  skillName: string
}

export interface IHandleSkillsOnboarding extends IServiceMethod {
  skills: ISkillData[]
  userId: string
}

export interface ISkillService {
  getDefaultSkills(): AsyncResponse<Skill[]>
  checkSkill(params: ICheckSkill): AsyncResponse<string>
  createSkill(params: ICreateSkill): AsyncResponse<string>
  handleSkillsOnboarding(
    params: IHandleSkillsOnboarding
  ): AsyncResponse<ResponseCode>
}
