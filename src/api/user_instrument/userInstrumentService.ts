import { ResponseCode } from '../../interface'
import { ICreateUserInstrument, IUserInstrumentService } from './interface'
import { AppDataSource } from '../../services/typeorm'
import { Repository } from 'typeorm'
import { logger } from '../../logger'
import { getResponseMessage } from '../../services/utils'
import { autoInjectable } from 'tsyringe'
import { UserInstrument } from './userInstrumentModel'

@autoInjectable()
export class UserInstrumentService implements IUserInstrumentService {
  private readonly userInstrumentRepository: Repository<UserInstrument>

  constructor() {
    this.userInstrumentRepository =
      AppDataSource.manager.getRepository(UserInstrument)
  }

  createUserInstrument = async ({
    userId,
    instrumentId,
    queryRunner
  }: ICreateUserInstrument) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const insertResult = await this.userInstrumentRepository
        .createQueryBuilder('userInstrument', queryRunner)
        .insert()
        .into(UserInstrument)
        .values([
          {
            userId,
            instrumentId
          }
        ])
        .execute()

      if (insertResult.raw.affectedRows !== 1) {
        return { code: ResponseCode.FAILED_INSERT }
      }

      return {
        userInstrumentId: insertResult.identifiers[0].id as string,
        code
      }
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
