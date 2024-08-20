import { ResponseCode } from '../../interface'
import { logger } from '../../logger'
import { getResponseMessage } from '../../services/utils'
import { autoInjectable, container } from 'tsyringe'
import { AppDataSource } from '../../services/typeorm'
import { Instrument } from './instrumentModel'
import { Repository } from 'typeorm'
import {
  ICheckInstrument,
  ICreateInstrument,
  IHandleInstrumentsOnboarding,
  IInstrumentService
} from './interface'
import { UserInstrumentService } from '../user_instrument/userInstrumentService'

const userInstrumentService = container.resolve(UserInstrumentService)

@autoInjectable()
export class InstrumentService implements IInstrumentService {
  private readonly instrumentRepository: Repository<Instrument>

  constructor() {
    this.instrumentRepository = AppDataSource.manager.getRepository(Instrument)
  }

  getDefaultInstruments = async () => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const defaultInstruments = await this.instrumentRepository.find({
        where: {
          defaultInstrument: true
        }
      })

      return { defaultInstruments, code }
    } catch (err: any) {
      code = ResponseCode.SERVER_ERROR
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }

    return { code }
  }

  checkInstrument = async ({
    instrumentName,
    queryRunner
  }: ICheckInstrument) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const instrument = await this.instrumentRepository
        .createQueryBuilder('instrument', queryRunner)
        .where('instrument = :instrumentName', { instrumentName })
        .getOne()

      if (!instrument) {
        return { code: ResponseCode.INSTRUMENT_NOT_FOUND }
      }

      return { instrumentId: instrument.id, code }
    } catch (err: any) {
      code = ResponseCode.SERVER_ERROR
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }

    return { code }
  }

  createInstrument = async ({
    instrumentName,
    queryRunner
  }: ICreateInstrument) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const insertResult = await this.instrumentRepository
        .createQueryBuilder('instrument', queryRunner)
        .insert()
        .into(Instrument)
        .values([
          {
            instrument: instrumentName,
            defaultInstrument: false
          }
        ])
        .execute()

      if (insertResult.raw.affectedRows !== 1) {
        return { code: ResponseCode.FAILED_INSERT }
      }

      return { instrumentId: insertResult.identifiers[0].id as string, code }
    } catch (err: any) {
      code = ResponseCode.SERVER_ERROR
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }

    return { code }
  }

  handleInstrumentOnboarding = async ({
    userId,
    instruments,
    queryRunner
  }: IHandleInstrumentsOnboarding) => {
    let code: ResponseCode = ResponseCode.OK
    try {
      for (const instrumentName of instruments) {
        let { instrumentId, code } = await this.checkInstrument({
          instrumentName,
          queryRunner
        })

        if (!instrumentId) {
          const { instrumentId: newInstrumentId, code: instrumentCode } =
            await this.createInstrument({ instrumentName, queryRunner })

          if (!newInstrumentId) {
            code = instrumentCode
            break
          }

          instrumentId = newInstrumentId
        }

        const { userInstrumentId, code: userInstrumentCode } =
          await userInstrumentService.createUserInstrument({
            userId,
            instrumentId,
            queryRunner
          })

        if (!userInstrumentId) {
          code = userInstrumentCode
          break
        }
      }

      return { code }
    } catch (err: any) {
      code = ResponseCode.SERVER_ERROR
      logger.error({
        code,
        message: getResponseMessage(code),
        stack: err.stack
      })
    }
    return { code }
  }
}
