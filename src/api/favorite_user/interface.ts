import { AsyncResponse, ResponseCode } from '../../interface'
import { FavoriteUser } from './favoriteUserModel'

export interface IToogleFavoriteUser {
  ownerId: string
  userId: string
}

export interface IGetFavoriteUsersForUser {
  userId: string
}

export interface IFavoriteService {
  toogleFavorite(params: IToogleFavoriteUser): AsyncResponse<ResponseCode>
  getFavoritesForUser(
    params: IGetFavoriteUsersForUser
  ): AsyncResponse<FavoriteUser[]>
}
