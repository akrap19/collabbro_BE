import { AsyncResponse, ResponseCode } from '../../interface'
import { FavoriteProject } from './favoriteProjectModel'

export interface IToogleFavoriteProject {
  projectId: string
  userId: string
}

export interface IGetFavoriteProjectsForUser {
  userId: string
}

export interface IFavoriteProjectService {
  toogleFavoriteProject(
    params: IToogleFavoriteProject
  ): AsyncResponse<ResponseCode>
  getFavoriteProjectsForUser(
    params: IGetFavoriteProjectsForUser
  ): AsyncResponse<FavoriteProject[]>
}
