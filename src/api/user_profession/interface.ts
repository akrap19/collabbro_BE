import { AsyncResponse, IServiceMethod } from '../../interface'

export interface ICreateUserProfession extends IServiceMethod {
  userId: string
  professionId: string
}

export interface IUserProfessionService {
  createUserProfession(params: ICreateUserProfession): AsyncResponse<string>
}
