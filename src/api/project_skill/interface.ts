import { AsyncResponse, IServiceMethod, ResponseCode } from '../../interface'

export interface ICreateProjectSkills extends IServiceMethod {
  projectId: string
  skillIds: string[]
}

export interface IProjectSkillService {
  createProjectSkills(params: ICreateProjectSkills): AsyncResponse<ResponseCode>
}
