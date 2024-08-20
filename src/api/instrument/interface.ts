import { AsyncResponse, IServiceMethod, ResponseCode } from '../../interface'
import { Instrument } from './instrumentModel'

export interface ICheckInstrument extends IServiceMethod {
  instrumentName: string
}

export interface ICreateInstrument extends IServiceMethod {
  instrumentName: string
}

export interface IHandleInstrumentsOnboarding extends IServiceMethod {
  userId: string
  instruments: string[]
}

export interface IInstrumentService {
  getDefaultInstruments(): AsyncResponse<Instrument[]>
  checkInstrument(params: ICheckInstrument): AsyncResponse<string>
  createInstrument(params: ICreateInstrument): AsyncResponse<string>
  handleInstrumentOnboarding(
    params: IHandleInstrumentsOnboarding
  ): AsyncResponse<ResponseCode>
}
