import { AsyncResponse, IServiceMethod } from '../../interface'

export interface ICreateUserSkill extends IServiceMethod {
  userId: string
  skillId: string
}

export interface IUserSkillService {
  createUserSkill(params: ICreateUserSkill): AsyncResponse<string>
}
