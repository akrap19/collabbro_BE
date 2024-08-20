import { AsyncResponse, IServiceMethod, ResponseCode } from '../../interface'

export interface ICreateProjectInstruments extends IServiceMethod {
  projectId: string
  instrumentIds: string[]
}

export interface IProjectInstrumentService {
  createProjectInstruments(
    params: ICreateProjectInstruments
  ): AsyncResponse<ResponseCode>
}
