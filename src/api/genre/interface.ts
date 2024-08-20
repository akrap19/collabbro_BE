import { AsyncResponse, IServiceMethod, ResponseCode } from '../../interface'
import { Genre } from './genreModel'

export interface ICheckGenre extends IServiceMethod {
  genreName: string
}

export interface ICreateGenre extends IServiceMethod {
  genreName: string
}

export interface IHandleGenresOnboarding extends IServiceMethod {
  userId: string
  genres: string[]
}

export interface IGenreService {
  getDefaultGenres(): AsyncResponse<Genre[]>
  checkGenre(params: ICheckGenre): AsyncResponse<string>
  createGenre(params: ICreateGenre): AsyncResponse<string>
  handleGenresOnboarding(
    params: IHandleGenresOnboarding
  ): AsyncResponse<ResponseCode>
}
