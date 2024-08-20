import { AsyncResponse, IServiceMethod, ResponseCode } from '../../interface'
import { SkillLevel } from '../user_skill/interface'

export interface ISkillData {
  id: string
  skillLevel: SkillLevel
}

export interface ICreateProjectSkills extends IServiceMethod {
  projectId: string
  skills: ISkillData[]
}

export interface IProjectSkillService {
  createProjectSkills(params: ICreateProjectSkills): AsyncResponse<ResponseCode>
}
