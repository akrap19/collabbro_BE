import { ResponseCode } from '../../interface'
import { ICreateUserProfession, IUserProfessionService } from './interface'
import { AppDataSource } from '../../services/typeorm'
import { Repository } from 'typeorm'
import { logger } from '../../logger'
import { getResponseMessage } from '../../services/utils'
import { autoInjectable } from 'tsyringe'
import { UserProfession } from './userProfessionModel'

@autoInjectable()
export class UserProfessionService implements IUserProfessionService {
  private readonly userProfessionRepository: Repository<UserProfession>

  constructor() {
    this.userProfessionRepository =
      AppDataSource.manager.getRepository(UserProfession)
  }

  createUserProfession = async ({
    userId,
    professionId,
    queryRunner
  }: ICreateUserProfession) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const insertResult = await this.userProfessionRepository
        .createQueryBuilder('userProfession', queryRunner)
        .insert()
        .into(UserProfession)
        .values([
          {
            userId,
            professionId
          }
        ])
        .execute()

      if (insertResult.raw.affectedRows !== 1) {
        return { code: ResponseCode.FAILED_INSERT }
      }

      return {
        userProfessionId: insertResult.identifiers[0].id as string,
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
