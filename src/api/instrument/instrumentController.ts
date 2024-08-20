import { NextFunction, Request, Response } from 'express'
import { ResponseCode } from '../../interface'
import { autoInjectable } from 'tsyringe'
import { InstrumentService } from './instrumentService'

@autoInjectable()
export class InstrumentController {
  private readonly instrumentService: InstrumentService

  constructor(instrumentService: InstrumentService) {
    this.instrumentService = instrumentService
  }

  getDefault = async (req: Request, res: Response, next: NextFunction) => {
    const { defaultInstruments, code } =
      await this.instrumentService.getDefaultInstruments()
    if (!defaultInstruments) {
      return next({ code })
    }

    return next({
      data: {
        defaultInstruments
      },
      code: ResponseCode.OK
    })
  }
}
