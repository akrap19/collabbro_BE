import { ResponseCode } from '../../interface'
import { ICreateUserGenre, IUserGenreService } from './interface'
import { AppDataSource } from '../../services/typeorm'
import { Repository } from 'typeorm'
import { logger } from '../../logger'
import { getResponseMessage } from '../../services/utils'
import { autoInjectable } from 'tsyringe'
import { UserGenre } from './userGenreModel'

@autoInjectable()
export class UserGenreService implements IUserGenreService {
  private readonly userGenreRepository: Repository<UserGenre>

  constructor() {
    this.userGenreRepository = AppDataSource.manager.getRepository(UserGenre)
  }

  createUserGenre = async ({
    userId,
    genreId,
    queryRunner
  }: ICreateUserGenre) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const insertResult = await this.userGenreRepository
        .createQueryBuilder('userGenre', queryRunner)
        .insert()
        .into(UserGenre)
        .values([
          {
            userId,
            genreId
          }
        ])
        .execute()

      if (insertResult.raw.affectedRows !== 1) {
        return { code: ResponseCode.FAILED_INSERT }
      }

      return { userGenreId: insertResult.identifiers[0].id as string, code }
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
