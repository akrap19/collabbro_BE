import { ResponseCode } from '../../interface'
import { logger } from '../../logger'
import { getResponseMessage } from '../../services/utils'
import { autoInjectable, container } from 'tsyringe'
import { AppDataSource } from '../../services/typeorm'
import { Genre } from './genreModel'
import { Repository } from 'typeorm'
import {
  ICheckGenre,
  ICreateGenre,
  IGenreService,
  IHandleGenresOnboarding
} from './interface'
import { UserGenreService } from '../user_genre/userGenreService'

const userGenreService = container.resolve(UserGenreService)

@autoInjectable()
export class GenreService implements IGenreService {
  private readonly genreRepository: Repository<Genre>

  constructor() {
    this.genreRepository = AppDataSource.manager.getRepository(Genre)
  }

  getDefaultGenres = async () => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const defaultGenres = await this.genreRepository.find({
        where: {
          defaultGenre: true
        }
      })

      return { defaultGenres, code }
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

  checkGenre = async ({ genreName, queryRunner }: ICheckGenre) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const genre = await this.genreRepository
        .createQueryBuilder('genre', queryRunner)
        .where('genre = :genreName', { genreName })
        .getOne()

      if (!genre) {
        return { code: ResponseCode.GENRE_NOT_FOUND }
      }

      return { genreId: genre.id, code }
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

  createGenre = async ({ genreName, queryRunner }: ICreateGenre) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const insertResult = await this.genreRepository
        .createQueryBuilder('genre', queryRunner)
        .insert()
        .into(Genre)
        .values([
          {
            genre: genreName,
            defaultGenre: false
          }
        ])
        .execute()

      if (insertResult.raw.affectedRows !== 1) {
        return { code: ResponseCode.FAILED_INSERT }
      }

      return { genreId: insertResult.identifiers[0].id as string, code }
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

  handleGenresOnboarding = async ({
    userId,
    genres,
    queryRunner
  }: IHandleGenresOnboarding) => {
    let code: ResponseCode = ResponseCode.OK
    try {
      for (const genreName of genres) {
        let { genreId, code } = await this.checkGenre({
          genreName,
          queryRunner
        })

        if (!genreId) {
          const { genreId: newGenreId, code: genreCode } =
            await this.createGenre({ genreName, queryRunner })

          if (!newGenreId) {
            code = genreCode
            break
          }
          genreId = newGenreId
        }

        const { userGenreId, code: userGenreCode } =
          await userGenreService.createUserGenre({
            userId,
            genreId,
            queryRunner
          })

        if (!userGenreId) {
          code = userGenreCode
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
