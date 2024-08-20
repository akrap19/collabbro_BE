import { AsyncResponse, IServiceMethod } from '../../interface'

export interface ICreateUserInstrument extends IServiceMethod {
  userId: string
  instrumentId: string
}

export interface IUserInstrumentService {
  createUserInstrument(params: ICreateUserInstrument): AsyncResponse<string>
}
