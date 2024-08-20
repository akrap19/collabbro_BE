import { AsyncResponse, IServiceMethod } from '../../interface'

export interface ICreateUserGenre extends IServiceMethod {
  userId: string
  genreId: string
}

export interface IUserGenreService {
  createUserGenre(params: ICreateUserGenre): AsyncResponse<string>
}
