import { ResponseCode } from '../../interface'
import { logger } from '../../logger'
import { getResponseMessage } from '../../services/utils'
import { autoInjectable } from 'tsyringe'
import { AppDataSource } from '../../services/typeorm'
import { Repository } from 'typeorm'
import { FavoriteUser } from './favoriteUserModel'
import { IGetFavoriteUsersForUser, IToogleFavoriteUser } from './interface'

@autoInjectable()
export class FavoriteUserService implements FavoriteUserService {
  private readonly favoriteUserRepository: Repository<FavoriteUser>

  constructor() {
    this.favoriteUserRepository =
      AppDataSource.manager.getRepository(FavoriteUser)
  }

  getFavoriteUsersForUser = async ({ userId }: IGetFavoriteUsersForUser) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const favoriteUsers = await this.favoriteUserRepository.find({
        where: {
          ownerId: userId
        }
      })

      return { favoriteUsers, code }
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

  toogleFavoriteUser = async ({ ownerId, userId }: IToogleFavoriteUser) => {
    let code: ResponseCode = ResponseCode.OK

    try {
      const favoriteUser = await this.favoriteUserRepository.findOne({
        where: {
          ownerId,
          userId
        }
      })

      if (favoriteUser === null) {
        const newFavoriteUser = await this.favoriteUserRepository.save({
          ownerId,
          userId
        })

        if (!newFavoriteUser.id) {
          return { code: ResponseCode.FAILED_INSERT }
        }

        return { code }
      }

      await this.favoriteUserRepository.remove(favoriteUser)

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
