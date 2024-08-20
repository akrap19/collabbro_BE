import { AsyncResponse, IServiceMethod, ResponseCode } from '../../interface'
import { Profession } from './professionModel'

export interface ICheckProfession extends IServiceMethod {
  professionName: string
}

export interface ICreateProfession extends IServiceMethod {
  professionName: string
}

export interface IHandleProfessionsOnboarding extends IServiceMethod {
  userId: string
  professions: string[]
}

export interface IProfessionService {
  getDefaultProfessions(): AsyncResponse<Profession[]>
  checkProfession(params: ICheckProfession): AsyncResponse<string>
  createProfession(params: ICreateProfession): AsyncResponse<string>
  handleProffesionsOnboarding(
    params: IHandleProfessionsOnboarding
  ): AsyncResponse<ResponseCode>
}
